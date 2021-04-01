export class Analytics {
    send(category, action) {
        if (globalIsLocalhost) return;

        ga('send', {
            hitType: 'event',
            eventCategory: category,
            eventAction: action
        });
    }
}

// window.objEditorMap = new EditorMap();
// window.objGeneric = new Generic();

// objEditorMap.construct('game');

// window.addEventListener('load',
//     window.objGameManagement.watchLoad(), {
//         once: true
//     });