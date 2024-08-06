<?php

namespace App\Service;

use DateTime;
use App\Entity\User;
use App\Entity\Opinion;
use App\Entity\Warranty;
use Symfony\Component\Mime\Email;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Mailer\MailerInterface;
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
            $this->sendEmailAboutExpiry($user, $warranty);
        }
    }

    private function sendEmailAboutExpiry(User $user, Warranty $warranty)
    {
        $warrantyEndDate = $warranty->getWarrantyEndDate();
        try{
            $email = (new Email())
            ->from($this->fromEmail)
            ->to($user->getEmail())
            ->subject('Your product warranty is about to expire')
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

    public function sendEmailAboutOpinionDelete(User $user, Opinion $opinion)
    {
        $now = new \DateTime();
        $now1 = $now->format('Y-m-d');
        try{
            $email = (new Email())
            ->from($this->fromEmail)
            ->to($user->getEmail())
            ->subject('Your product opinion has been deleted')
            ->html(sprintf(
                '<p>Hello %s,</p>
                <p>Your opinion for the product <b>%s</b> in the category <b>%s</b> published on %s has been deleted due to violation of the terms of service.</p>
                <p>Content of the opinion: <b>%s</b></p>
                <p>Time of deletion: %s</p>
                <p>Sincerely,</p>
                <p>Moderation team of OpinionApp</p>',
                $user->getIdUserDetails()->getName(),
                $opinion->getProduct()->getProductName(),
                $opinion->getProduct()->getCategory()->getCategoryName(),
                $opinion->getCreatedAt()->format('Y-m-d H:i:s'),
                $opinion->getOpinionText(),
                $now1

            ));
        $this->mailer->send($email);
        error_log(print_r("[".$now->format('Y-m-d H:i:s') ,true)."] - An email to ". $user->getEmail()." was successfully sent");
        }catch(\Exception $e){
            error_log("Error while sending email - ". $e->getMessage());
            error_log("Details: " . print_r($e, true));
        }
    }
}
