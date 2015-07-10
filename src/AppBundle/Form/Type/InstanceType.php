<?php

namespace AppBundle\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class InstanceType extends AbstractType
{
    /**
     * {@inheritdoc}
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('title', 'text', [
                'error_bubbling' => false
            ])
            ->add('kindof', 'choice', [
                'choices'  => ['boolean' => 'boolean', 'countdown' => 'countdown']
            ])
            ->add('end_at', 'datetime')
            ->add('text_false', 'text')
            ->add('text_true', 'text');
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            "allow_extra_fields" => true,
            'csrf_protection' => false
        ));
    }

    public function getName() {
        return 'Instance';
    }
}