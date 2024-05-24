<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240524101449 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE opinion ADD durability_rating DOUBLE PRECISION DEFAULT NULL');
        $this->addSql('ALTER TABLE opinion ADD design_rating DOUBLE PRECISION DEFAULT NULL');
        $this->addSql('ALTER TABLE opinion ADD price_rating DOUBLE PRECISION DEFAULT NULL');
        $this->addSql('ALTER TABLE opinion ADD capabilities_rating DOUBLE PRECISION DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE opinion DROP durability_rating');
        $this->addSql('ALTER TABLE opinion DROP design_rating');
        $this->addSql('ALTER TABLE opinion DROP price_rating');
        $this->addSql('ALTER TABLE opinion DROP capabilities_rating');
    }
}
