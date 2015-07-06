<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Rhumsaa\Uuid\Uuid;
use Rhumsaa\Uuid\Exception\UnsatisfiedDependencyException;

/**
 * Instance
 *
 * @ORM\Entity
 * @ORM\InheritanceType("SINGLE_TABLE")
 * @ORM\DiscriminatorColumn(name="kind", type="string")
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
     * @ORM\Column(name="title", type="string")
     */
    private $title;

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
}
