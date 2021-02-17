<?php

return [
    //MainController
    '' => [
        'controller' => 'main',
        'action' => 'index'
    ],
    'main/index/{page:\d+}' => [
        'controller' => 'main',
        'action' => 'index'
    ],
    'about' => [
        'controller' => 'main',
        'action' => 'about'
    ],
    'contact' => [
        'controller' => 'main',
        'action' => 'contact'
    ],
    'privacy' => [
        'controller' => 'main',
        'action' => 'privacy'
    ],
    'post/{id:\d+}' => [
        'controller' => 'main',
        'action' => 'post'
    ],

    //AccountController
    'account/login' => [
        'controller' => 'account',
        'action' => 'login'
    ],
    'account/register' => [
        'controller' => 'account',
        'action' => 'register'
    ],
    'account/confirm/{token:\w+}' => [
        'controller' => 'account',
        'action' => 'confirm'
    ],
    'account/preconfirm/{id:\d+}' => [
        'controller' => 'account',
        'action' => 'preconfirm'
    ],
    'account/profile' => [
        'controller' => 'account',
        'action' => 'profile'
    ],
    'account/userprofile/{id:\d+}' => [
        'controller' => 'account',
        'action' => 'userprofile'
    ],
    'account/logout' => [
        'controller' => 'account',
        'action' => 'logout'
    ],

    //AdminController
    'admin/login' => [
        'controller' => 'admin',
        'action' => 'login'
    ],
    'admin/logout' => [
        'controller' => 'admin',
        'action' => 'logout'
    ],
    'admin/add' => [
        'controller' => 'admin',
        'action' => 'add'
    ],
    'admin/edit/{id:\d+}' => [
        'controller' => 'admin',
        'action' => 'edit'
    ],
    'admin/delete/{id:\d+}' => [
        'controller' => 'admin',
        'action' => 'delete'
    ],
    'admin/posts/{page:\d+}' => [
        'controller' => 'admin',
        'action' => 'posts'
    ],
    'admin/users/{page:\d+}' => [
        'controller' => 'admin',
        'action' => 'users'
    ]
];