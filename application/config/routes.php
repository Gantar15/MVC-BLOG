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
    //posts
    'admin/postadd' => [
        'controller' => 'admin',
        'action' => 'postadd'
    ],
    'admin/postedit/{id:\d+}' => [
        'controller' => 'admin',
        'action' => 'postedit'
    ],
    'admin/postdelete/{id:\d+}' => [
        'controller' => 'admin',
        'action' => 'postdelete'
    ],
    'admin/posts/{page:\d+}' => [
        'controller' => 'admin',
        'action' => 'posts'
    ],
    'admin/postsearch/{page:\d+}' => [
        'controller' => 'admin',
        'action' => 'postsearch'
    ],
    //users
    'admin/users/{page:\d+}' => [
        'controller' => 'admin',
        'action' => 'users'
    ],
    //categories
    'admin/categories/{page:\d+}' => [
        'controller' => 'admin',
        'action' => 'categories'
    ],
    'admin/categorysearch/{page:\d+}' => [
        'controller' => 'admin',
        'action' => 'categorysearch'
    ],
    'admin/categorydelete/{id:\d+}' => [
        'controller' => 'admin',
        'action' => 'categorydelete'
    ],
    //tags
    'admin/tags/{page:\d+}' => [
        'controller' => 'admin',
        'action' => 'tags'
    ],
    'admin/tagdelete/{id:\d+}' => [
        'controller' => 'admin',
        'action' => 'tagdelete'
    ],
    'admin/tagsearch/{page:\d+}' => [
        'controller' => 'admin',
        'action' => 'tagsearch'
    ]
];