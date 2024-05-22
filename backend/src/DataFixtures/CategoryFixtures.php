<?php

namespace App\DataFixtures;

use App\Entity\Category;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class CategoryFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        /*
        // Główne kategorie
        $electronics = new Category();
        $electronics->setCategoryName('Elektronika');
        $manager->persist($electronics);

        $fashion = new Category();
        $fashion->setCategoryName('Moda');
        $manager->persist($fashion);

        $home = new Category();
        $home->setCategoryName('Dom i Ogród');
        $manager->persist($home);
        $this->addReference('category-home', $home);

        $automotive = new Category();
        $automotive->setCategoryName('Motoryzacja');
        $manager->persist($automotive);
        $this->addReference('category-automotive', $automotive);

        $sports = new Category();
        $sports->setCategoryName('Sport');
        $manager->persist($sports);
        $this->addReference('category-sports', $sports);

        $health = new Category();
        $health->setCategoryName('Zdrowie');
        $manager->persist($health);
        $this->addReference('category-health', $health);

        // Podkategorie dla Elektroniki
        $phones = new Category();
        $phones->setCategoryName('Telefony');
        $phones->setParentCategory($electronics);
        $manager->persist($phones);

        $tvs = new Category();
        $tvs->setCategoryName('Telewizory');
        $tvs->setParentCategory($electronics);
        $manager->persist($tvs);

        $laptops = new Category();
        $laptops->setCategoryName('Laptopy');
        $laptops->setParentCategory($electronics);
        $manager->persist($laptops);

        $tablets = new Category();
        $tablets->setCategoryName('Tablety');
        $tablets->setParentCategory($electronics);
        $manager->persist($tablets);

        $pcs = new Category();
        $pcs->setCategoryName('Komputery osobiste');
        $pcs->setParentCategory($electronics);
        $manager->persist($pcs);

        $phoneAccessories = new Category();
        $phoneAccessories->setCategoryName('Akcesoria do telefonów');
        $phoneAccessories->setParentCategory($phones);
        $manager->persist($phoneAccessories);
        // Zabawki (kategoria nadrzędna)
        $toys = new Category();
        $toys->setCategoryName('Zabawki');
        $manager->persist($toys);
        $this->addReference('category-toys', $toys);

         // Podkategorie dla Mody
         $mensFashion = new Category();
         $mensFashion->setCategoryName('Moda Męska');
         $mensFashion->setParentCategory($fashion);
         $manager->persist($mensFashion);
 
         $womensFashion = new Category();
         $womensFashion->setCategoryName('Moda Damska');
         $womensFashion->setParentCategory($fashion);
         $manager->persist($womensFashion);

        // Podkategorie dla Zabawek
        $actionFigures = new Category();
        $actionFigures->setCategoryName('Figurki Akcji');
        $actionFigures->setParentCategory($this->getReference('category-toys'));
        $manager->persist($actionFigures);

        $legoSets = new Category();
        $legoSets->setCategoryName('Zestawy LEGO');
        $legoSets->setParentCategory($this->getReference('category-toys'));
        $manager->persist($legoSets);

        $dolls = new Category();
        $dolls->setCategoryName('Lalki');
        $dolls->setParentCategory($this->getReference('category-toys'));
        $manager->persist($dolls);

        // Podkategorie dla Dom i Ogród
        $kitchen = new Category();
        $kitchen->setCategoryName('Kuchnia');
        $kitchen->setParentCategory($this->getReference('category-home'));
        $manager->persist($kitchen);

        $garden = new Category();
        $garden->setCategoryName('Ogród');
        $garden->setParentCategory($this->getReference('category-home'));
        $manager->persist($garden);

        // Podkategorie dla Kuchni
        $appliances = new Category();
        $appliances->setCategoryName('Sprzęt AGD');
        $appliances->setParentCategory($kitchen); // Używamy obiektu bez referencji
        $manager->persist($appliances);

        $gardenTools = new Category();
        $gardenTools->setCategoryName('Narzędzia ogrodowe');
        $gardenTools->setParentCategory($home);
        $manager->persist($gardenTools);

        $furniture = new Category();
        $furniture->setCategoryName('Meble do domu');
        $furniture->setParentCategory($home);
        $manager->persist($furniture);

        $lighting = new Category();
        $lighting->setCategoryName('Lampy i oświetlenie');
        $lighting->setParentCategory($home);
        $manager->persist($lighting);

        $cutlery = new Category();
        $cutlery->setCategoryName('Sztućce i naczynia');
        $cutlery->setParentCategory($home);
        $manager->persist($cutlery);
    */
    // Pobranie repozytorium encji Category
    $categoryRepository = $manager->getRepository(Category::class);

    // Wyszukanie istniejącego obiektu w bazie danych
    $phones = $categoryRepository->findOneBy(['CategoryName' => 'Telefony']);

    if (!$phones) {
        throw new \Exception('Category "Telefony" not found.');
    }

    $charger = new Category();
    $charger->setCategoryName('Ładowarki');
    $charger->setParentCategory($phones);
    $manager->persist($charger);
        // Zapis do bazy danych
        $manager->flush();
    }


}
