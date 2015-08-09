<?php

namespace AppBundle\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;

use AppBundle\Entity\Instance;

class InstanceType extends AbstractType
{
    /**
     * {@inheritdoc}
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('type', 'choice', [
                'choices'  => ['boolean' => 'boolean', 'countdown' => 'countdown'],
                'mapped' => false,
                'error_bubbling' => false
            ])

            ->add('title', 'text', [
                'error_bubbling' => false
            ])

            ->add('createdBy', 'text', [
                'error_bubbling' => false
            ])

            ->add('textFalse', 'text', [
                'error_bubbling' => false
            ])
            ->add('textTrue', 'text', [
                'error_bubbling' => false
            ]);

            $builder->addEventListener(FormEvents::PRE_SUBMIT , function (FormEvent $event) {
                $form = $event->getForm();
                $reflect = new \ReflectionClass($form->getData());

                if (strtolower($reflect->getShortName()) === Instance::TYPE_COUNTDOWN) {

                    /*
                     * 'text' is used instead of 'datetime' as datetime has apparently trouble validating the ISO 8601 date format,
                     * so as we do not use the form rendering, the validating only needs to be done by the entity assertion.
                     */
/*                    $form->add('endAt', 'text', [
                        'error_bubbling' => false
                    ]);*/

                    $form->add('endAt', 'datetime', [
                        'date_format' => "yyyy-MM-dd'T'HH:mm:ssZZZ",
                        'format' => "yyyy-MM-dd'T'HH:mm:ssZZZ",
                        'date_widget' => 'single_text',
                        'time_widget' => 'single_text',
                        'error_bubbling' => false
                    ]);
                }
            });
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            "allow_extra_fields" => true,
            'csrf_protection' => false,
            'validation_groups' => function (FormInterface $form) {
                $data = $form->get('type')->getData();
                return [ucfirst($data), 'Default'];
            }
        ));
    }

    public function getName() {
        return 'Instance';
    }
}