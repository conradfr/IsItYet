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
            'createdBy' => $instance->getCreatedBy(),
            'createdAt' => $instance->getCreatedAt(),
            'type' => $type
        ];

        if ($type === Instance::TYPE_BOOLEAN) {
            $data['data']['status'] = $instance->getStatus();
        }
        elseif ($type === Instance::TYPE_COUNTDOWN) {
            $data['data']['endAt'] = $instance->getendAt();
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
