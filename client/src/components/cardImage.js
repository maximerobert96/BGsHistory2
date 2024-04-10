import React, { useState, useEffect } from 'react';

const CardImage = ({ card }) => {
  const [imageSrc, setImageSrc] = useState(null);

  const generatePlaceholderImage = (card) => {
    console.log("Generating new placeholder.");

    // const placeholderImageSrc = path;
    // setImageSrc(path);
  };

  useEffect(() => {
    const cardSrc = `/cards/en_US/${card.version}/${card.dbfId}.png`;
    const placeholderSrc = `/placeholder/en_US/${card.version}/${card.dbfId}.png`;
    fetch(cardSrc)
        .then(response => {
            if(response.ok && response.headers.get('Content-Type').startsWith('image/')) {
                console.log("Card image exists.");
                setImageSrc(cardSrc);
            } else {
                console.log("Card image does not exist. Fetching placeholder...");
                fetch(placeholderSrc)
                    .then(response2 => {
                        if(!(response2.ok && response2.headers.get('Content-Type').startsWith('image/'))){
                            generatePlaceholderImage(card);
                        } else {
                            console.log("Using placeholder that already exists.")
                            setImageSrc(placeholderSrc);
                        }
                    });
            }
        }).catch( error => {
            console.error("Error fetching card image:", error);
        });
  }, [card]);

  return (
    <img
      src={imageSrc}
      onError={(e)=>{e.target.onError = null; e.target.src = "/icons/placeholder.png"}}
      alt="Hover"
      className="hover-image"
    />
  );
};

export default CardImage;
