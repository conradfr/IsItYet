<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Rhumsaa\Uuid\Uuid;
use Rhumsaa\Uuid\Exception\UnsatisfiedDependencyException;
use Gedmo\Mapping\Annotation as Gedmo;

/**
 * Instance
 *
 * @ORM\Entity
 * @ORM\InheritanceType("SINGLE_TABLE")
 * @ORM\DiscriminatorColumn(name="kindof", type="string")
 * @ORM\HasLifecycleCallbacks
 */
class Instance
{
    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="public_key", type="string")
     */
    private $publicKey;

    /**
     * @var string
     *
     * @ORM\Column(name="write_key", type="guid")
     */
    private $writeKey;

    /**
     * @var string
     *
     * @ORM\Column(name="kindof", type="string")
     */
    private $kindof;

    /**
     * @var string
     *
     * @ORM\Column(name="title", type="string", length=50)
     */
    private $title;

    /**
     * @var string
     *
     * @ORM\Column(name="text_false", type="string", length=25)
     */
    private $textFalse = 'No';

    /**
     * @var string
     *
     * @ORM\Column(name="text_true", type="string", length=25)
     */
    private $textTrue = 'Yes';

    /**
     * @var \DateTime $created
     *
     * @Gedmo\Timestampable(on="create")
     * @ORM\Column(type="datetime")
     */
    private $createdAt;

    /**
     * @var \DateTime $updated
     *
     * @Gedmo\Timestampable(on="update")
     * @ORM\Column(type="datetime")
     */
    private $updatedAt;

    /** @ORM\PrePersist */
    public function createUuidOnPrePersist()
    {
        try {
            // Generate a version 4 (random) UUID object
            $uuid4 = Uuid::uuid4();
            $this->writeKey = $uuid4->toString();
        } catch (UnsatisfiedDependencyException $e) {
            echo 'Caught exception: ' . $e->getMessage() . "\n";
        }
    }

    /**
     * Get id
     *
     * @return integer
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param string $publicKey
     */
    public function setPublicKey($publicKey)
    {
        $this->publicKey = $publicKey;
    }

    /**
     * @return string
     */
    public function getPublicKey()
    {
        return $this->publicKey;
    }

    /**
     * @param string $writeKey
     */
    public function setWriteKey($writeKey)
    {
        $this->writeKey = $writeKey;
    }

    /**
     * @return string
     */
    public function getWriteKey()
    {
        return $this->writeKey;
    }

    /**
     * @return string
     */
    public function getKindof()
    {
        return $this->kindof;
    }

    /**
     * @param string $kindof
     */
    public function setKindof($kindof)
    {
        $this->kindof = $kindof;
    }

    /**
     * @param string $title
     */
    public function setTitle($title)
    {
        $this->title = $title;
    }

    /**
     * @return string
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * @return string
     */
    public function getTextFalse()
    {
        return $this->textFalse;
    }

    /**
     * @param string $textFalse
     */
    public function setTextFalse($textFalse)
    {
        $this->textFalse = $textFalse;
    }

    /**
     * @return string
     */
    public function getTextTrue()
    {
        return $this->textTrue;
    }

    /**
     * @param string $textTrue
     */
    public function setTextTrue($textTrue)
    {
        $this->textTrue = $textTrue;
    }

    /**
     * @return \DateTime
     */
    public function getCreatedAt()
    {
        return $this->createdAt;
    }

    /**
     * @param \DateTime $createdAt
     */
    public function setCreatedAt($createdAt)
    {
        $this->createdAt = $createdAt;
    }

    /**
     * @return \DateTime
     */
    public function getUpdatedAt()
    {
        return $this->updatedAt;
    }

    /**
     * @param \DateTime $updatedAt
     */
    public function setUpdatedAt($updatedAt)
    {
        $this->updatedAt = $updatedAt;
    }
}
