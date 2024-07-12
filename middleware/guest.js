

import {
    menuItems
} from "../components/menu";

export default function ({ app, store, route, redirect}) {
    console.log('middleware');
    if (window.$registration) {
        console.log('pagemove_update')
        window.$registration.update();
    }

    redirect();
}
