<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240515161356 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SEQUENCE category_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE opinion_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE product_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE category (id INT NOT NULL, parent_category_id INT DEFAULT NULL, category_name VARCHAR(255) NOT NULL, description TEXT DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_64C19C1796A8F92 ON category (parent_category_id)');
        $this->addSql('CREATE TABLE opinion (id INT NOT NULL, product_id INT NOT NULL, created_by_id INT NOT NULL, opinion_text TEXT NOT NULL, rating DOUBLE PRECISION NOT NULL, thumbs_up INT DEFAULT NULL, thumbs_down INT DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_AB02B0274584665A ON opinion (product_id)');
        $this->addSql('CREATE INDEX IDX_AB02B027B03A8386 ON opinion (created_by_id)');
        $this->addSql('CREATE TABLE product (id INT NOT NULL, category_id INT NOT NULL, product_name VARCHAR(255) NOT NULL, description TEXT DEFAULT NULL, image VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_D34A04AD12469DE2 ON product (category_id)');
        $this->addSql('ALTER TABLE category ADD CONSTRAINT FK_64C19C1796A8F92 FOREIGN KEY (parent_category_id) REFERENCES category (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE opinion ADD CONSTRAINT FK_AB02B0274584665A FOREIGN KEY (product_id) REFERENCES product (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE opinion ADD CONSTRAINT FK_AB02B027B03A8386 FOREIGN KEY (created_by_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE product ADD CONSTRAINT FK_D34A04AD12469DE2 FOREIGN KEY (category_id) REFERENCES category (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('DROP SEQUENCE category_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE opinion_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE product_id_seq CASCADE');
        $this->addSql('ALTER TABLE category DROP CONSTRAINT FK_64C19C1796A8F92');
        $this->addSql('ALTER TABLE opinion DROP CONSTRAINT FK_AB02B0274584665A');
        $this->addSql('ALTER TABLE opinion DROP CONSTRAINT FK_AB02B027B03A8386');
        $this->addSql('ALTER TABLE product DROP CONSTRAINT FK_D34A04AD12469DE2');
        $this->addSql('DROP TABLE category');
        $this->addSql('DROP TABLE opinion');
        $this->addSql('DROP TABLE product');
    }
}