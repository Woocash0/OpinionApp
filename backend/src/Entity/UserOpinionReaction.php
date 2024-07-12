<?php

namespace App\Entity;

use App\Entity\User;
use App\Entity\Opinion;
use Doctrine\ORM\Mapping as ORM;
use App\Repository\UserOpinionReactionRepository;

#[ORM\Entity(repositoryClass: UserOpinionReactionRepository::class)]
class UserOpinionReaction
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'userOpinionReactions')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $voter = null;

    #[ORM\ManyToOne(inversedBy: 'userOpinionReactions')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Opinion $opinion = null;

    #[ORM\Column(length: 4)]
    private ?string $reaction = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getVoter(): ?User
    {
        return $this->voter;
    }

    public function setVoter(?User $voter): static
    {
        $this->voter = $voter;

        return $this;
    }

    public function getOpinion(): ?Opinion
    {
        return $this->opinion;
    }

    public function setOpinion(?Opinion $opinion): static
    {
        $this->opinion = $opinion;

        return $this;
    }

    public function getReaction(): ?string
    {
        return $this->reaction;
    }

    public function setReaction(string $reaction): static
    {
        $this->reaction = $reaction;

        return $this;
    }
}
