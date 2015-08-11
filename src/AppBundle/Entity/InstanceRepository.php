<?php

namespace AppBundle\Entity;

use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\Mapping as ORM;
use AppBundle\Entity\Instance;

class InstanceRepository extends EntityRepository
{
    /**
     * @param $instance
     */
    public function getInstanceType($instance) {
        return $this->getEntityManager()->getMetadataFactory()->getMetadataFor(get_class($instance))->discriminatorValue;
    }

    /**
     * Create an array formatted for the client app
     * @param $instance
     * @param boolean $withWriteKey Includes the write key
     *
     * @todo look into JSM Serializer to handle it automatically
     */
    public function getExportableInstance($instance, $withWriteKey=false) {
        $data = [];

        $type = $this->getInstanceType($instance);

        $data['data'] = [
            'publicKey' => $instance->getPublicKey(),
            'title' => $instance->getTitle(),
            'textFalse' => $instance->getTextFalse(),
            'textTrue' => $instance->getTextTrue(),
            'isDemo' => $instance->isIsDemo(),
            'createdBy' => $instance->getCreatedBy(),
            'createdAt' => $instance->getCreatedAt(),
            'type' => $type
        ];

        if ($type === Instance::TYPE_BOOLEAN) {
            $data['data']['status'] = $instance->getStatus();
        }
        elseif ($type === Instance::TYPE_COUNTDOWN) {
            $instanceEndAt = $instance->getendAt(false);
            $endAtFormat = 'Y-m-d H:i:s';

            if ($instance->getUseTimezone() === true) {
                $endAtFormat = \DateTime::ISO8601;

                // Put back the time offset minus the client's offset
                $offsetDuration = $instance->getTimeOffset() - ($instanceEndAt->getOffset() / 60);
                $offsetInterval = new \DateInterval('PT'. abs($offsetDuration) .'M');

                if($offsetDuration > 0) { $instanceEndAt->sub($offsetInterval); }
                else { $instanceEndAt->add($offsetInterval); }
            }

            $data['data']['endAt'] = $instanceEndAt->format($endAtFormat);
            // $data['data']['useTimezone'] = $instance->getUseTimezone();
            // $data['data']['timeOffset'] = $instance->getTimeOffset();
        }

        if ($withWriteKey === true) {
            $data['data']['writeKey'] = $instance->getWriteKey();
        }

        $data['status'] = [
            'isCreated' => true,
            'isDeleted' => false,
            'hasErrors' => false
        ];

        return $data;
    }
}
