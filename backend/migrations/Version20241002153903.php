<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241002153903 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE house (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE product (id INT AUTO_INCREMENT NOT NULL, house_id INT NOT NULL, name VARCHAR(255) NOT NULL, category VARCHAR(255) NOT NULL, total_quantity INT DEFAULT NULL, photo LONGTEXT DEFAULT NULL, INDEX IDX_D34A04AD6BB74515 (house_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE product_detail (id INT AUTO_INCREMENT NOT NULL, product_id INT NOT NULL, quantity INT NOT NULL, expiration_date DATETIME NOT NULL, INDEX IDX_4C7A3E374584665A (product_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE product_history (id INT AUTO_INCREMENT NOT NULL, product_id INT DEFAULT NULL, house_id INT NOT NULL, purchased_quantity INT NOT NULL, purchase_date DATETIME NOT NULL, INDEX IDX_F6636BFB4584665A (product_id), INDEX IDX_F6636BFB6BB74515 (house_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE shopping_list (id INT AUTO_INCREMENT NOT NULL, house_id INT NOT NULL, name VARCHAR(255) DEFAULT NULL, INDEX IDX_3DC1A4596BB74515 (house_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE shopping_list_product (shopping_list_id INT NOT NULL, product_id INT NOT NULL, INDEX IDX_DD8A4B6623245BF9 (shopping_list_id), INDEX IDX_DD8A4B664584665A (product_id), PRIMARY KEY(shopping_list_id, product_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user (id INT AUTO_INCREMENT NOT NULL, email VARCHAR(180) NOT NULL, roles JSON NOT NULL, password VARCHAR(255) NOT NULL, username VARCHAR(50) DEFAULT NULL, UNIQUE INDEX UNIQ_IDENTIFIER_EMAIL (email), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user_house (user_id INT NOT NULL, house_id INT NOT NULL, INDEX IDX_8517C2C5A76ED395 (user_id), INDEX IDX_8517C2C56BB74515 (house_id), PRIMARY KEY(user_id, house_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE product ADD CONSTRAINT FK_D34A04AD6BB74515 FOREIGN KEY (house_id) REFERENCES house (id)');
        $this->addSql('ALTER TABLE product_detail ADD CONSTRAINT FK_4C7A3E374584665A FOREIGN KEY (product_id) REFERENCES product (id)');
        $this->addSql('ALTER TABLE product_history ADD CONSTRAINT FK_F6636BFB4584665A FOREIGN KEY (product_id) REFERENCES product (id)');
        $this->addSql('ALTER TABLE product_history ADD CONSTRAINT FK_F6636BFB6BB74515 FOREIGN KEY (house_id) REFERENCES house (id)');
        $this->addSql('ALTER TABLE shopping_list ADD CONSTRAINT FK_3DC1A4596BB74515 FOREIGN KEY (house_id) REFERENCES house (id)');
        $this->addSql('ALTER TABLE shopping_list_product ADD CONSTRAINT FK_DD8A4B6623245BF9 FOREIGN KEY (shopping_list_id) REFERENCES shopping_list (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE shopping_list_product ADD CONSTRAINT FK_DD8A4B664584665A FOREIGN KEY (product_id) REFERENCES product (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user_house ADD CONSTRAINT FK_8517C2C5A76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user_house ADD CONSTRAINT FK_8517C2C56BB74515 FOREIGN KEY (house_id) REFERENCES house (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE product DROP FOREIGN KEY FK_D34A04AD6BB74515');
        $this->addSql('ALTER TABLE product_detail DROP FOREIGN KEY FK_4C7A3E374584665A');
        $this->addSql('ALTER TABLE product_history DROP FOREIGN KEY FK_F6636BFB4584665A');
        $this->addSql('ALTER TABLE product_history DROP FOREIGN KEY FK_F6636BFB6BB74515');
        $this->addSql('ALTER TABLE shopping_list DROP FOREIGN KEY FK_3DC1A4596BB74515');
        $this->addSql('ALTER TABLE shopping_list_product DROP FOREIGN KEY FK_DD8A4B6623245BF9');
        $this->addSql('ALTER TABLE shopping_list_product DROP FOREIGN KEY FK_DD8A4B664584665A');
        $this->addSql('ALTER TABLE user_house DROP FOREIGN KEY FK_8517C2C5A76ED395');
        $this->addSql('ALTER TABLE user_house DROP FOREIGN KEY FK_8517C2C56BB74515');
        $this->addSql('DROP TABLE house');
        $this->addSql('DROP TABLE product');
        $this->addSql('DROP TABLE product_detail');
        $this->addSql('DROP TABLE product_history');
        $this->addSql('DROP TABLE shopping_list');
        $this->addSql('DROP TABLE shopping_list_product');
        $this->addSql('DROP TABLE user');
        $this->addSql('DROP TABLE user_house');
    }
}
