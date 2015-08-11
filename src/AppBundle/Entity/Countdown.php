<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * Countdown instance
 *
 * @ORM\Entity(repositoryClass="AppBundle\Entity\InstanceRepository")
 */
class Countdown extends Instance
{
    /**
     * @var \DateTime
     *
     * @ORM\Column(name="end_at", type="datetime")
     * @Assert\NotBlank()
     */
    private $endAt;

    /**
     * @var int
     *
     * @ORM\Column(name="time_offset", type="integer")
     * @Assert\NotBlank()
     * @Assert\Type(type="integer")
     */
    private $timeOffset;

    /**
     * @var boolean
     *
     * @ORM\Column(name="use_timezone", type="boolean")
     */
    private $useTimezone = false;

    /**
     * @param \DateTime|string $endAt
     */
    public function setEndAt($endAt)
    {
        /*
         * As we do not rely on the datetime form input but text instead (cf comment in InstanceType),
         * we transform the input string into a DateTime here
         */
        if (is_string($endAt)) {
            $endAt = new \DateTime($endAt);
        }

        // We store the utc offset, datetime will be store without timezone, handling the useTimezone option with less effort
        $dateTimeZone = $endAt->getTimezone();
        $this->setTimeOffset($dateTimeZone->getOffset($endAt) / 60); // getOffset returns seconds, we want minutes

        $this->endAt = $endAt;
    }

    /**
     * @return \DateTime|string
     */
    public function getEndAt($asString=true)
    {
        if ($asString === true) {
            return $this->endAt->format(\DateTime::ISO8601);
        }

        return $this->endAt;
    }

    /**
     * @return int
     */
    public function getTimeOffset()
    {
        return $this->timeOffset;
    }

    /**
     * @param int $timeOffset
     */
    public function setTimeOffset($timeOffset)
    {
        $this->timeOffset = $timeOffset;
    }

    /**
     * @param boolean $useTimezone
     */
    public function setUseTimezone($useTimezone)
    {
        $this->useTimezone = $useTimezone;
    }

    /**
     * @return boolean
     */
    public function getUseTimezone()
    {
        return $this->useTimezone;
    }


}
