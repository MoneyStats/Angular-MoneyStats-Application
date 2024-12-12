import { Injectable } from '@angular/core';

declare var $: any; // Dichiara jQuery come variabile globale

@Injectable({
  providedIn: 'root',
})
export class DataTables {
  public static setDatatablesStyle(tableId: string, placeholder: string) {
    const defaultColor = '#284bff';
    const darkerDefault = '#1d3d9f';
    const hoverTextColor = '#ffffff'; // Colore del testo per hover

    // Seleziona l'input di ricerca
    const searchInput = document.querySelector(
      '.dt-search input[type="search"]'
    ) as HTMLInputElement;

    if (searchInput) {
      searchInput.style.borderRadius = '12px';
      searchInput.style.padding = '8px 12px';
      searchInput.style.fontSize = '14px';
      searchInput.placeholder = placeholder;
      searchInput.style.borderColor = defaultColor;
      searchInput.style.width = '300px';

      searchInput.addEventListener('focus', () => {
        searchInput.style.borderColor = darkerDefault;
      });
      searchInput.addEventListener('active', () => {
        searchInput.style.borderColor = darkerDefault;
      });
      searchInput.addEventListener('blur', () => {
        searchInput.style.borderColor = defaultColor;
      });
      searchInput.addEventListener('mouseover', () => {
        searchInput.style.borderColor = darkerDefault;
      });
      searchInput.addEventListener('mouseout', () => {
        searchInput.style.borderColor = defaultColor;
      });
    }

    // Seleziona la select per il numero di righe da visualizzare
    const lengthSelect = document.querySelector(
      `.dt-input[name="${tableId}_length"]`
    ) as HTMLSelectElement;

    if (lengthSelect) {
      lengthSelect.style.borderRadius = '12px';
      lengthSelect.style.padding = '8px 12px';
      lengthSelect.style.fontSize = '14px';
      lengthSelect.style.borderColor = defaultColor;

      lengthSelect.addEventListener('focus', () => {
        lengthSelect.style.borderColor = darkerDefault;
      });
      lengthSelect.addEventListener('blur', () => {
        lengthSelect.style.borderColor = defaultColor;
      });
      lengthSelect.addEventListener('mouseover', () => {
        lengthSelect.style.borderColor = darkerDefault;
      });
      lengthSelect.addEventListener('mouseout', () => {
        lengthSelect.style.borderColor = defaultColor;
      });
    }

    // Funzione per applicare lo stile alla numerazione delle pagine
    const applyPaginationStyles = () => {
      const paginationButtons = document.querySelectorAll(
        '.dt-paging-button'
      ) as NodeListOf<HTMLElement>;

      paginationButtons.forEach((button) => {
        button.style.borderRadius = '12px';
        button.style.padding = '8px 12px';
        button.style.fontSize = '14px';

        // Cambia il colore per i bottoni attivi
        if (button.classList.contains('current')) {
          button.style.backgroundColor = defaultColor;
          button.style.color = '#ffffff';
        }

        // Gestisci il comportamento di hover
        button.addEventListener('mouseover', () => {
          if (
            !button.classList.contains('disabled') &&
            !button.classList.contains('current')
          ) {
            button.style.background = darkerDefault; // Colore di sfondo durante l'hover
            button.style.color = hoverTextColor; // Colore del testo durante l'hover
          }
        });

        button.addEventListener('mouseout', () => {
          if (
            !button.classList.contains('disabled') &&
            !button.classList.contains('current')
          ) {
            button.style.backgroundColor = ''; // Rimuovi il colore di sfondo quando il mouse esce
            button.style.color = ''; // Rimuovi il colore del testo quando il mouse esce
          }
        });

        // Cambia il colore al focus
        button.addEventListener('focus', () => {
          if (
            !button.classList.contains('disabled') &&
            !button.classList.contains('current')
          ) {
            button.style.backgroundColor = darkerDefault;
            button.style.color = '#ffffff';
          }
        });

        // Ripristina il colore al termine del focus
        button.addEventListener('blur', () => {
          if (
            !button.classList.contains('disabled') &&
            !button.classList.contains('current')
          ) {
            button.style.backgroundColor = '';
            button.style.color = '';
          }
        });
      });
    };

    // Applica gli stili alla paginazione subito dopo il caricamento della pagina
    applyPaginationStyles();

    // Se usi DataTables, ascolta l'evento 'draw' per applicare gli stili quando la tabella viene ridisegnata (ad esempio, dopo un cambio pagina)
    if (typeof $ !== 'undefined' && $.fn.dataTable) {
      $(`#${tableId}`).on('draw.dt', () => {
        applyPaginationStyles();
      });
    }
  }
}
