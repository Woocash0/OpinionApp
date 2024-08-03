<?php

namespace App\Controller;

use App\Service\WarrantyNotificationService; // Zaktualizuj nazwę klasy serwisu
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class TestController extends AbstractController
{
    private $warrantyNotificationService;

    public function __construct(WarrantyNotificationService $warrantyNotificationService)
    {
        $this->warrantyNotificationService = $warrantyNotificationService;
    }

    #[Route('/test-send-warranty-notifications', name: 'test_send_warranty_notifications')]
    public function testSendWarrantyNotifications(): Response
    {
        $this->warrantyNotificationService->sendWarrantyExpiringNotifications();

        return new Response('Powiadomienia zostały wysłane');
    }
}
