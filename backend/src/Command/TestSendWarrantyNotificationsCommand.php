<?php

namespace App\Command;

use App\Service\WarrantyNotificationService;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

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
        $io = new SymfonyStyle($input, $output);

        $now = new \DateTime();
        $currentDateTime = $now->format('Y-m-d H:i:s');

        try {
            $this->warrantyNotificationService->sendWarrantyExpiringNotifications();            
            $content = sprintf(
                '[%s] - All emails successfully sent.',
                $currentDateTime
            );
            $io->success($content);

            return Command::SUCCESS;
        } catch (\Exception $e) {
            $errorMessage = sprintf(
                '[%s] - Error occurred: %s',
                $currentDateTime,
                $e->getMessage()
            );
            $io->error($errorMessage);

            return Command::FAILURE;
        }
    }
}
