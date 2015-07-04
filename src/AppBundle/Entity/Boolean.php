<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Boolean instance
 *
 * @ORM\Entity(repositoryClass="AppBundle\Entity\InstanceRepository")
 */
class Boolean extends Instance
{
    /**
     * @var boolean
     *
     * @ORM\Column(name="status", type="boolean")
     */
    private $status;

    /**
     * @param boolean $status
     */
    public function setStatus($status)
    {
        $this->status = $status;
    }

    /**
     * @return boolean
     */
    public function getStatus()
    {
        return $this->status;
    }


}
