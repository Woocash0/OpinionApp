<?php

namespace App\Entity;

use App\Repository\LoginRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: LoginRepository::class)]
class Login
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'logins')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $appuser = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $loginDate = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getAppuser(): ?User
    {
        return $this->appuser;
    }

    public function setAppuser(?User $appuser): static
    {
        $this->appuser = $appuser;

        return $this;
    }

    public function getLoginDate(): ?\DateTimeInterface
    {
        return $this->loginDate;
    }

    public function setLoginDate(\DateTimeInterface $loginDate): static
    {
        $this->loginDate = $loginDate;

        return $this;
    }
}
