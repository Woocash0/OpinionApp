<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240727125715 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE warranty ADD product_id INT NOT NULL');
        $this->addSql('ALTER TABLE warranty DROP category');
        $this->addSql('ALTER TABLE warranty DROP product_name');
        $this->addSql('ALTER TABLE warranty ADD CONSTRAINT FK_88D71CF24584665A FOREIGN KEY (product_id) REFERENCES product (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX IDX_88D71CF24584665A ON warranty (product_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE warranty DROP CONSTRAINT FK_88D71CF24584665A');
        $this->addSql('DROP INDEX IDX_88D71CF24584665A');
        $this->addSql('ALTER TABLE warranty ADD category VARCHAR(100) NOT NULL');
        $this->addSql('ALTER TABLE warranty ADD product_name VARCHAR(100) NOT NULL');
        $this->addSql('ALTER TABLE warranty DROP product_id');
    }
}
