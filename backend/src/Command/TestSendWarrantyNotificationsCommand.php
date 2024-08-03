<?php

namespace App\Command;

use App\Service\WarrantyNotificationService;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class TestSendWarrantyNotificationsCommand extends Command
{
    protected static $defaultName = 'app:test-send-warranty-notifications';

    private $warrantyNotificationService;

    public function __construct(WarrantyNotificationService $warrantyNotificationService)
    {
        $this->warrantyNotificationService = $warrantyNotificationService;
        parent::__construct();
    }

    protected function configure()
    {
        $this
            ->setDescription('Testowo wysyła powiadomienia o kończących się gwarancjach');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $this->warrantyNotificationService->sendWarrantyExpiringNotifications();
        
        $now = new \DateTime();
        $currentDateTime = $now->format('Y-m-d H:i:s');
        $content = sprintf(
            '[%s] - All emails successfully sent.',
            $currentDateTime
        );


        $output->writeln($content);

        return Command::SUCCESS;
    }
}
