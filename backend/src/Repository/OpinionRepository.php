<?php

namespace App\Repository;

use App\Entity\Opinion;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
/**
 * @extends ServiceEntityRepository<Opinion>
 *
 * @method Opinion|null find($id, $lockMode = null, $lockVersion = null)
 * @method Opinion|null findOneBy(array $criteria, array $orderBy = null)
 * @method Opinion[]    findAll()
 * @method Opinion[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class OpinionRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Opinion::class);
    }

    public function findUninspectedOpinions()
    {
        return $this->createQueryBuilder('o')
            ->where('o.inspected = false')
            ->getQuery()
            ->getResult();
    }

    public function getOpinionsByMonthAndYear()
    {
        $conn = $this->getEntityManager()->getConnection();

        $sql = '
        SELECT 
            TO_CHAR(o.created_at, \'YYYY-MM\') AS year_month,
            COUNT(o.id) AS opinions
        FROM opinion o
        GROUP BY TO_CHAR(o.created_at, \'YYYY-MM\')
        ORDER BY year_month
        ';

        $stmt = $conn->executeQuery($sql);
        return $stmt->fetchAllAssociative();
    }

//    /**
//     * @return Opinion[] Returns an array of Opinion objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('o')
//            ->andWhere('o.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('o.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?Opinion
//    {
//        return $this->createQueryBuilder('o')
//            ->andWhere('o.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
