const Routes = [
  {
    path: '/',
    component: () => import('@/views/dashboard/Layout.vue'),
    redirect: { name: 'drinkMenu' },
    children: [
      {
        path: '/drink/menu',
        name: 'drinkMenu',
        component: () => import('@/views/dashboard/DrinkMenu.vue')
      },
      {
        path: '/option/groups',
        name: 'optionGroups',
        component: () => import('@/views/dashboard/OptionGroups.vue')
      },
      {
        path: '/drink/options',
        name: 'drinkOptions',
        component: () => import('@/views/dashboard/DrinkOptions.vue')
      }
    ]
  }
]
export default Routes
