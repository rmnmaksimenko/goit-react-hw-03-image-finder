import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { Component } from 'react';
import { Modal } from './modal/modal';
import './styles.css';
import { ImageGalleryItem } from './ImageGalleryItem';
import { LoadMore } from './Button';

const API_KEY = '27863078-b4a956cfdf1b52b765bed6289';

export default class Search extends Component {
  state = {
    page: 1,
    pictures: [],
    totalPages: null,
    showModal: false,
    largeURL: '',
  };

  toggleModal = e => {
    if (e) {
      this.setState({ largeURL: e.currentTarget.attributes.large.textContent });
    }
    this.setState(({ showModal }) => ({
      showModal: !showModal,
    }));
  };

  onLoadMore = () => {
    this.setState({ page: this.state.page + 1 });
  };

  componentDidUpdate(prevProps, prevState) {
    const prevName = prevProps.onSearch;
    const thisName = this.props.onSearch;
    const prevPage = prevState.page;
    const thisPage = this.state.page;
    const searchWord = this.props.onSearch.trim();
    if (!searchWord) {
      return toast.warn('Type something first', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    // console.log(prevPage, thisPage);
    if (prevName !== thisName || prevPage < thisPage) {
      // console.log('Идёт поиск...');
      fetch(
        `https://pixabay.com/api/?key=${API_KEY}&q=${this.props.onSearch}&image_type=photo&page=${thisPage}&per_page=12`
      )
        .then(res => {
          if (res.ok) {
            return res.json();
          }
          return;
        })
        .then(pictures => {
          if (prevName !== thisName) {
            this.setState({
              pictures: pictures.hits,
              totalPages: Math.ceil(pictures.totalHits / 12),
              page: 1,
            });
            if (pictures.hits.length === 0) {
              return toast.warn('Nothing was found', {
                position: 'top-center',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
            }
            return;
          }
          // console.log(pictures.hits.length);
          this.setState({
            pictures: [...this.state.pictures, ...pictures.hits],
          });
        });
    }
  }

  render() {
    const { showModal } = this.state;
    // console.log(this.state.pictures);
    let endOfSearch = false;
    // console.log(this.state.page);
    // console.log(this.state.totalPages);
    // console.log(this.state);
    // console.log(this.props);
    if (this.state.pictures.length === 0) {
      return;
    }
    if (
      this.state.page === this.state.totalPages &&
      this.state.pictures.length > 0
    ) {
      endOfSearch = true;
    }

    return (
      <div>
        {this.state.pictures && (
          <ul className="ImageGallery">
            {this.state.pictures.map(pic => {
              return (
                <ImageGalleryItem
                  key={pic.id}
                  webformatURL={pic.webformatURL}
                  largeImageURL={pic.largeImageURL}
                  toggleModal={this.toggleModal}
                />
              );
            })}
          </ul>
        )}
        {this.state.page < this.state.totalPages ? (
          <LoadMore onLoadMore={this.onLoadMore} />
        ) : null}
        {endOfSearch === true ? (
          <h2 className="EndOfSearch" т>
            End of Search
          </h2>
        ) : null}
        {showModal && (
          <Modal onCloseModal={this.toggleModal}>
            {<img src={this.state.largeURL} alt="" />}
          </Modal>
        )}
      </div>
    );
  }
}

Search.propTypes = {
  onSearch: PropTypes.string.isRequired,
};
