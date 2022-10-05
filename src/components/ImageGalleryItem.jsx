import PropTypes from 'prop-types';
import './styles.css';

export function ImageGalleryItem(pic) {
  // console.log(pic.setLargeUrl);
  return (
    <li>
      {
        <img
          className="ImageGalleryItem-image"
          src={pic.webformatURL}
          width="300"
          alt=""
          large={pic.largeImageURL}
          onClick={function () {
            pic.toggleModal();
            console.log(pic.setLargeUrl);
            pic.setLargeUrl(pic.largeImageURL);
          }}
        />
      }
    </li>
  );
}

ImageGalleryItem.propTypes = {
  pic: PropTypes.arrayOf(
    PropTypes.shape({
      webformatURL: PropTypes.string.isRequired,
      largeImageURL: PropTypes.string.isRequired,
      toggleModal: PropTypes.func.isRequired,
      setLargeUrl: PropTypes.func.isRequired,
    })
  ),
};
