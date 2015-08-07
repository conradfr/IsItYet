<?php

require __DIR__ . '/../vendor/autoload.php';

use AppBundle\Utils\Pusher;
use AppBundle\Utils\YamlAppLoader;
use Symfony\Component\Config\FileLocator;

/* Config */

$configDirectories = array(__DIR__.'/../app/config');
$locator = new FileLocator($configDirectories);
$loader = new YamlAppLoader($locator);
$configValues = $loader->load($locator->locate('app_parameters.yml'));

/* Websocket */

$loop = React\EventLoop\Factory::create();
$pusher = new Pusher();

$client = new Predis\Async\Client('tcp://127.0.0.1:6379', $loop);
$client->connect(array($pusher, 'init'));

// Set up our WebSocket server for clients wanting real-time updates
$webSock = new React\Socket\Server($loop);

$webSock->listen($configValues['parameters']['ws_port'], '0.0.0.0'); // Binding to 0.0.0.0 means remotes can connect
$webServer = new Ratchet\Server\IoServer(
    new Ratchet\Http\HttpServer(
        new Ratchet\WebSocket\WsServer(
            new Ratchet\Wamp\WampServer(
                $pusher
            )
        )
    ),
    $webSock
);

$loop->run();