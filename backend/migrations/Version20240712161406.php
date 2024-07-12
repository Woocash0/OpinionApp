<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240712161406 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SEQUENCE user_opinion_reaction_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE user_opinion_reaction (id INT NOT NULL, voter_id INT NOT NULL, opinion_id INT NOT NULL, reaction VARCHAR(4) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_2320C983EBB4B8AD ON user_opinion_reaction (voter_id)');
        $this->addSql('CREATE INDEX IDX_2320C98351885A6A ON user_opinion_reaction (opinion_id)');
        $this->addSql('ALTER TABLE user_opinion_reaction ADD CONSTRAINT FK_2320C983EBB4B8AD FOREIGN KEY (voter_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE user_opinion_reaction ADD CONSTRAINT FK_2320C98351885A6A FOREIGN KEY (opinion_id) REFERENCES opinion (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('DROP SEQUENCE user_opinion_reaction_id_seq CASCADE');
        $this->addSql('ALTER TABLE user_opinion_reaction DROP CONSTRAINT FK_2320C983EBB4B8AD');
        $this->addSql('ALTER TABLE user_opinion_reaction DROP CONSTRAINT FK_2320C98351885A6A');
        $this->addSql('DROP TABLE user_opinion_reaction');
    }
}
