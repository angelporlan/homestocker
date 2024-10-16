<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Repository\FriendRepository;

#[ORM\Entity(repositoryClass: FriendRepository::class)]
#[ORM\Table(name: "friends")]
class Friend
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: "integer")]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user = null;  // El usuario que envía la solicitud de amistad

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $friend = null;  // El usuario que recibe la solicitud de amistad

    #[ORM\Column(type: "boolean")]
    private bool $isConfirmed = false; 

    #[ORM\Column(type: "datetime")]
    private \DateTime $createdAt; 

    #[ORM\Column(type: "datetime", nullable: true)]
    private ?\DateTime $confirmedAt = null; 

    
    public function __construct()
    {
        $this->createdAt = new \DateTime();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;

        return $this;
    }

    public function getFriend(): ?User
    {
        return $this->friend;
    }

    public function setFriend(?User $friend): static
    {
        $this->friend = $friend;

        return $this;
    }

    public function isConfirmed(): bool
    {
        return $this->isConfirmed;
    }

    public function setIsConfirmed(bool $isConfirmed): static
    {
        $this->isConfirmed = $isConfirmed;

        return $this;
    }

    public function getCreatedAt(): \DateTime
    {
        return $this->createdAt;
    }

    public function getConfirmedAt(): ?\DateTime
    {
        return $this->confirmedAt;
    }

    public function setConfirmedAt(?\DateTime $confirmedAt): static
    {
        $this->confirmedAt = $confirmedAt;

        return $this;
    }
}
