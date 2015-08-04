<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;


use AppBundle\Entity\Instance,
    AppBundle\Entity\Boolean as InstanceBoolean,
    AppBundle\Form\Type\InstanceType;

class DefaultController extends Controller
{
    /**
     * @Route("/instance/{publicKey}/{writeKey}", name="app", defaults={"publicKey"="", "writeKey"=""})
     * @Method({"GET"})
     */
    public function appAction($publicKey, $writeKey)
    {
        $responseData = [];

        // Dispatch or get instance data based on optional keys
        if ((!empty($publicKey)) && (empty($writeKey))) {
            return $this->forward('AppBundle:Default:view', ['publicKey' => $publicKey]);
        }
        elseif ((!empty($publicKey)) && (!empty($writeKey))) {
            $instance = $this->getDoctrine()->getRepository('AppBundle:Instance')->findOneBy(['publicKey' => $publicKey, 'writeKey' => $writeKey]);

            if (!$instance) {
                throw $this->createNotFoundException('The requested instance has not been found.');
            }

//          $responseData['instance'] = $instance;
            $responseData['instance'] = $this->getDoctrine()->getRepository('AppBundle:Instance')->getExportableInstance($instance, true);
        }

        return $this->render('default/app.html.twig', $responseData);
    }

    /**
     * @Route("/i/{publicKey}", name="instance_view")
     */
    public function viewAction($publicKey)
    {
        $instance = $this->getDoctrine()->getRepository('AppBundle:Instance')->findOneByPublicKey($publicKey);

        if (!$instance) {
            throw $this->createNotFoundException('The requested instance has not been found.');
        }

        $instanceExport = $this->getDoctrine()->getRepository('AppBundle:Instance')->getExportableInstance($instance);

        return $this->render('default/instance.html.twig', [
            'instance' => $instanceExport
        ]);
    }

    /**
     * @Route("/instance", name="instance_submit")
     * @Method({"POST"})
     */
    public function submitAction(Request $request)
    {
        // Type validation (pre-form)
        $instanceTypeParam = $request->request->get('type', '');
        $typeConstraint = new Assert\Choice();
        $typeConstraint->choices = [Instance::TYPE_BOOLEAN, Instance::TYPE_COUNTDOWN];

        $instanceTypeError = $this->get('validator')->validate(
            $instanceTypeParam,
            $typeConstraint
        );

        if (count($instanceTypeError) > 0) {
            throw $this->createAccessDeniedException('Error');
        }

        $response = new JsonResponse();
        $responseData = [];

        $instanceTypeClass = "AppBundle\\Entity\\" . ucfirst($instanceTypeParam);
        $instance = new $instanceTypeClass();

        $form = $this->createForm(new instanceType(), $instance);

        // $form->handleRequest($request);
//        $form->submit($request->request->all(), false);
        $form->submit($request->request->all());

        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->persist($instance);
            $em->flush();

            // Construct response
            $responseData = $this->getDoctrine()->getRepository('AppBundle:Instance')->getExportableInstance($instance, true);
/*            $responseData = [
                'data' => [
                    'title' => $instance->getTitle(),
                    'textFalse' => $instance->getTextFalse(),
                    'textTrue' => $instance->getTextTrue(),
                ],
                'meta' => [
                    'publicKey' => $instance->getPublicKey(),
                    'writeKey' => $instance->getWriteKey(),
                    'editLink' => $this->generateUrl('app', ['publicKey' => $instance->getPublicKey(), 'writeKey' => $instance->getWriteKey()], true)
                ],
                'status' => [
                    'created' => true,
                    'error' => false,
                    'deleted' => false
                ]
            ];*/

            $response->setData($responseData);
        } else {
            $response->setStatusCode(400)
                ->setData([
                    // send normalized data
                    'data' => [
                        'title' => $instance->getTitle(),
                        'textFalse' => $instance->getTextFalse(),
                        'textTrue' => $instance->getTextTrue(),
                    ],
                    'status' => [
                        'isCreated' => false,
                        'isDeleted' => false,
                        'hasErrors' => true,
                        'errors' => $this->get('form_serializer')->serializeFormErrors($form, false, false)
                    ]
                ]);
        }

        return $response;
    }

    /**
     * @Route("/instance/{publicKey}/{writeKey}", name="instance_edit")
     * @Method({"POST"})
     */
    public function editAction($publicKey, $writeKey, Request $request)
    {
        $doctrine = $this->getDoctrine();

        $baseInstance = $doctrine->getRepository('AppBundle:Instance')->findOneBy(['publicKey' => $publicKey, 'writeKey' => $writeKey]);
        if (!$baseInstance) {
            throw $this->createNotFoundException('The requested instance has not been found.');
        }

        $response = new JsonResponse();
        $responseData = [];

        $type = $doctrine->getRepository('AppBundle:Instance')->getInstanceType($baseInstance);

        $instance = $doctrine->getRepository('AppBundle:' . ucfirst($type))->findOneBy(['publicKey' => $publicKey, 'writeKey' => $writeKey]);
        unset($type, $baseInstance);

        $form = $this->createForm(new instanceType(), $instance);

        $form->submit($request->request->all());

        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->persist($instance);
            $em->flush();

            // Construct response
            $responseData = $this->getDoctrine()->getRepository('AppBundle:Instance')->getExportableInstance($instance);
            /*            $responseData = [
                            'data' => [
                                'title' => $instance->getTitle(),
                                'textFalse' => $instance->getTextFalse(),
                                'textTrue' => $instance->getTextTrue(),
                            ],
                            'meta' => [
                                'publicKey' => $instance->getPublicKey(),
                                'writeKey' => $instance->getWriteKey(),
                                'editLink' => $this->generateUrl('app', ['publicKey' => $instance->getPublicKey(), 'writeKey' => $instance->getWriteKey()], true)
                            ],
                            'status' => [
                                'created' => true,
                                'error' => false,
                                'deleted' => false
                            ]
                        ];*/

            $response->setData($responseData);
        } else {
            $response->setStatusCode(400)
                ->setData([
                    // send normalized data
                    'data' => [
                        'title' => $instance->getTitle(),
                        'textFalse' => $instance->getTextFalse(),
                        'textTrue' => $instance->getTextTrue(),
                    ],
                    'status' => [
                        'isCreated' => false,
                        'isDeleted' => false,
                        'hasErrors' => true,
                        'errors' => $this->get('form_serializer')->serializeFormErrors($form, false, false)
                    ]
                ]);
        }

        return $response;

    }

    /**
     * @Route("/instance/status/{publicKey}/{writeKey}", name="instance_status")
     * @Method({"POST"})
     */
    public function statusAction($publicKey, $writeKey, Request $request)
    {
        $content = $request->getContent();
        if (!empty($content)) {
            $statusParam = json_decode($content, true)['status']; // 2nd param to get as array
        }

        // Status type validation (boolean)
        $typeConstraint = new Assert\Type(array(
            'type'    => 'boolean'
        ));

        $typeError = $this->get('validator')->validate(
            $statusParam,
            $typeConstraint
        );

        if (count($typeError) > 0) {
            throw new BadRequestHttpException("Invalid status");
        }

        $em = $this->getDoctrine()->getManager();
        $response = new JsonResponse();
        $responseData = [];

        /** @var InstanceBoolean $instance */
        $instance = $this->getDoctrine()->getRepository('AppBundle:Boolean')->findOneBy(['publicKey' => $publicKey, 'writeKey' => $writeKey]);

        if (!$instance) {
            $response->setStatusCode(404);
        } else {
            $instance->setStatus($statusParam);
            $em->flush();

            $responseData = [
                'data' => ['status' => $statusParam],
                'status' => [
                    'hasErrors' => false,
                    'isStatusUpdated' => true
                ]
            ];
            $serializer = $this->get('jms_serializer');

            /** @var \Predis\Client */
            $redis = $this->container->get('snc_redis.default');
            $redis->PUBLISH($instance->getPublicKey(), $serializer->serialize($responseData, 'json'));

            $response->setData($responseData);
        }

        return $response;
    }

    /**
     * @Route("/i/{publicKey}/{writeKey}", name="instance_delete")
     * @Method({"DELETE"})
     */
    public function deleteAction($publicKey, $writeKey)
    {
        $em = $this->getDoctrine()->getManager();

        $response = new JsonResponse();

        $instance = $this->getDoctrine()->getRepository('AppBundle:Instance')->findOneBy(['publicKey' => $publicKey, 'writeKey' => $writeKey]);

        if (!$instance) {
            $response->setStatusCode(404);
        } else {
            $em->remove($instance);
            $em->flush();

            $response->setData(['delete' => true]);
        }

        return $response;
    }
}
