<?php

namespace App\Service;

use App\Entity\User;
use App\Entity\Warranty;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Doctrine\ORM\EntityManagerInterface;
use DateTime;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

class WarrantyNotificationService
{
    private $mailer;
    private $em;
    private $fromEmail;

    public function __construct(MailerInterface $mailer, EntityManagerInterface $em, ParameterBagInterface $params)
    {
        $this->mailer = $mailer;
        $this->em = $em;
        $this->fromEmail = $params->get('mailer_from_email');
        
    }

    public function sendWarrantyExpiringNotifications()
    {
        $now = new \DateTime();
        $now1 = $now->format('Y-m-d');
        $warranties = $this->em->getRepository(Warranty::class)->createQueryBuilder('w')
            ->where('DATE_SUB(w.warrantyEndDate, 1, \'MONTH\') = :now')
            ->setParameter('now', $now1)
            ->getQuery()
            ->getResult();


        foreach ($warranties as $warranty) {
            $user = $warranty->getIdUser();
            $this->sendEmail($user, $warranty);
        }
    }

    private function sendEmail(User $user, Warranty $warranty)
    {
        $warrantyEndDate = $warranty->getWarrantyEndDate();
        try{
            $email = (new Email())
            ->from($this->fromEmail)
            ->to($user->getEmail())
            ->subject('Twoja gwarancja na produkt wkrótce wygasa')
            ->html(sprintf(
                '<p>Hello %s,</p><p>Your Warranty for the product <b>%s</b> in the category <b>%s</b> ends <b>%s</b>.</p><p>Sent automatically from OpinionApp</p>',
                $user->getIdUserDetails()->getName(),
                $warranty->getProduct()->getProductName(),
                $warranty->getProduct()->getCategory()->getCategoryName(),
                $warrantyEndDate->format('Y-m-d')
            ));
        $this->mailer->send($email);
        $now = new \Datetime;
        error_log(print_r("[".$now->format('Y-m-d H:i:s') ,true)."] - An email to ". $user->getEmail()." was successfully sent");
        }catch(\Exception $e){
            error_log("Error while sending email - ". $e->getMessage());
            error_log("Details: " . print_r($e, true));
        }
    }
}
