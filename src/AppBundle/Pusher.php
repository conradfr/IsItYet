<?php

namespace AppBundle;

use Ratchet\ConnectionInterface;
use Ratchet\Wamp\WampServerInterface;

/**
 * Class Pusher
 * Inspired by https://github.com/jmoz/silex-test/blob/master/src/RatchetApp/Pusher.php
 * @package IsItYet
 */
class Pusher implements WampServerInterface {

    /**
     * @var array A lookup of all the topics clients have subscribed to
     */
    public $subscribedTopics = array();

    protected $redis;

    public function init($client) {
        $this->redis = $client;
    }

    /**
     * @param $event
     * @param $pubsub
     */
    public function pubsub($event, $pubsub) {
        if (isset($event->channel)) {
            echo $event->payload;
            $topic = $this->subscribedTopics[$event->channel];
            $topic->broadcast($event->payload);
        } else {
            // error ?
        }
    }

    public function onSubscribe(ConnectionInterface $conn, $topic) {
        if (!array_key_exists($topic->getId(), $this->subscribedTopics)) {
            $this->subscribedTopics[$topic->getId()] = $topic;
            $this->redis->pubSubLoop($topic->getId(), array($this, 'pubsub'));
        }
    }

    public function onUnSubscribe(ConnectionInterface $conn, $topic) {

    }

    public function onOpen(ConnectionInterface $conn) {

    }

    public function onClose(ConnectionInterface $conn) {

    }

    public function onCall(ConnectionInterface $conn, $id, $topic, array $params) {

    }

    public function onPublish(ConnectionInterface $conn, $topic, $event, array $exclude, array $eligible) {

    }

    public function onError(ConnectionInterface $conn, \Exception $e) {

    }
}