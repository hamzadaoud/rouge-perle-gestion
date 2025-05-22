
import { Order } from "../types";

export const generateThankYouMessage = (): string => {
  const messages = [
    "Merci pour votre visite! Nous espérons vous revoir très bientôt chez La Perle Rouge.",
    "Votre sourire est notre plus belle récompense. À très vite chez La Perle Rouge!",
    "La Perle Rouge vous remercie de votre confiance. Au plaisir de vous servir à nouveau!",
    "Un café chez La Perle Rouge, c'est un moment de bonheur à partager. Revenez vite!",
    "Merci d'avoir choisi La Perle Rouge. Nous vous attendons pour votre prochaine pause café!"
  ];
  
  return messages[Math.floor(Math.random() * messages.length)];
};

export const printTicket = (order: Order): void => {
  // Dans une vraie application, cette fonction serait connectée à une imprimante à tickets
  // Mais pour cette démo, nous allons ouvrir une nouvelle fenêtre avec le contenu du ticket
  
  const ticket = `
    <html>
    <head>
      <title>Ticket - La Perle Rouge</title>
      <style>
        body {
          font-family: 'Courier New', monospace;
          text-align: center;
          padding: 1rem;
          width: 300px;
          margin: 0 auto;
        }
        .header {
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 1rem;
        }
        .date {
          margin-bottom: 1rem;
          font-size: 0.8rem;
        }
        .item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
          text-align: left;
        }
        .item-name {
          width: 60%;
        }
        .item-price {
          width: 40%;
          text-align: right;
        }
        .total {
          margin-top: 1rem;
          font-weight: bold;
          border-top: 1px dashed black;
          padding-top: 0.5rem;
          font-size: 1.2rem;
        }
        .footer {
          margin-top: 2rem;
          font-size: 0.8rem;
        }
        .barcode {
          margin-top: 1rem;
          font-family: 'Libre Barcode 39', cursive;
          font-size: 2.5rem;
        }
        .message {
          margin-top: 1rem;
          font-style: italic;
          font-size: 0.9rem;
        }
      </style>
      <link href="https://fonts.googleapis.com/css2?family=Libre+Barcode+39&display=swap" rel="stylesheet">
    </head>
    <body>
      <div class="header">LA PERLE ROUGE</div>
      <div class="date">${new Date(order.date).toLocaleString()}</div>
      <div class="server">Serveur: ${order.agentName}</div>
      <div class="items">
        ${order.items.map((item, index) => `
          <div class="item">
            <div class="item-name">${index + 1}. ${item.quantity}x ${item.drinkName}</div>
            <div class="item-price">${(item.unitPrice * item.quantity).toFixed(2)} MAD</div>
          </div>
        `).join('')}
      </div>
      <div class="total">Total: ${order.total.toFixed(2)} MAD</div>
      <div class="barcode">${order.id}</div>
      <div class="message">${generateThankYouMessage()}</div>
      <div class="footer">Merci de votre visite!</div>
    </body>
    </html>
  `;
  
  const printWindow = window.open('', '_blank', 'width=400,height=600');
  if (printWindow) {
    printWindow.document.write(ticket);
    printWindow.document.close();
    // Lancer l'impression automatiquement après un court délai
    setTimeout(() => {
      printWindow.print();
    }, 500);
  } else {
    alert("Veuillez autoriser les fenêtres popup pour imprimer le ticket.");
  }
};

