//imports
importScripts('js/sw-utils.js');

const STATIC_CACHE = 'static-v2';
const DYNAMIC_CACHE = 'dynamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1';

const APP_SHELL = [
    //'/',
    'index.html',
    'css/style.css',
    'js/app.js',
    'js/sw-utils.js'
];

const APP_SHELL_INMUTABLE = [

];

self.addEventListener('install', e =>{ //evento de instalación.

    //almacenar en el cache el APP_SHELL.
    const cacheStatic = caches.open( STATIC_CACHE ).then( cache =>// Crea el cache con open, 
        cache.addAll( APP_SHELL)); //luego agrega el APP_SHELL al cache creado.
    
    //almacenar en el cache el APP_SHELL_INMUTABLE.
    const cacheInmutable = caches.open( INMUTABLE_CACHE ).then( cache =>// Crea el cache con open, 
    cache.addAll( APP_SHELL_INMUTABLE)); //luego agrega el APP_SHELL al cache creado.

    e.waitUntil( Promise.all([ cacheStatic, cacheInmutable ]));
});


//cada vez que cambie el sw me borre los caches anteriores que ya no van a servir, con el activate.
self.addEventListener('activate', e =>{

    const respuesta = caches.keys().then( keys => {

        keys.forEach( key => {

            if (  key !== STATIC_CACHE && key.includes('static') ) {
                return caches.delete(key);
            }

        });

    });

    e.waitUntil( respuesta );

});



self.addEventListener('fetch', e =>{

    const respuesta = caches.match( e.request ).then( res =>{

        if( res ){
            return res;
        } else{

            return fetch( e.request ).then( newRes =>{

                return actualizarCacheDinamico( DYNAMIC_CACHE, e.request, newRes)
            });
        }

    })

    e.respondWith( respuesta );

});