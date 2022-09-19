import { Component } from 'react';
import Modal from './modal';
import './styles.css';

const API_KEY = '27863078-b4a956cfdf1b52b765bed6289';

export default class Search extends Component {
  state = {
    keyword: '',
    page: 1,
    error: null,
    status: 'idle',
    searchString: '',
    pictures: [],
    totalPages: null,
    showModal: false,
    largeURL: '',
  };

  onSearch = () => {
    // e.preventDefault();
    // this.setState({
    //   searchString: `https://pixabay.com/api/?key=${API_KEY}&q=${this.state.keyword}&image_type=photo&per_page=15`,
    // });
    console.log(this.state.keyword, this.state.searchString);
    fetch(
      `https://pixabay.com/api/?key=${API_KEY}&q=${this.props.onSearch}&image_type=photo&per_page=15`
    )
      .then(res => {
        if (res.ok) {
          return res.json();
        }
        return Promise.reject(new Error('Поиск не удался'));
      })
      .then(pictures => this.setState({ pictures: pictures }));
  };

  toggleModal = e => {
    if (e) {
      this.setState({ largeURL: e.currentTarget.attributes.large.textContent });
      console.log(e.currentTarget.attributes.large.textContent);
    }
    this.setState(({ showModal }) => ({
      showModal: !showModal,
    }));
  };

  handleClick = () => {
    console.log('кликнул по картинке');
  };

  onLoadMore = () => {
    // console.log(this.state.pictures);
    this.setState({ page: this.state.page + 1 });
  };

  componentDidUpdate(prevProps, prevState) {
    const prevName = prevProps.onSearch;
    const thisName = this.props.onSearch;
    const prevPage = prevState.page;
    const thisPage = this.state.page;
    if (prevName !== thisName) {
      this.setState({ pictures: [] });
    }
    if (prevName !== thisName || prevPage !== thisPage) {
      console.log('Идёт поиск...');
      fetch(
        `https://pixabay.com/api/?key=${API_KEY}&q=${this.props.onSearch}&image_type=photo&page=${thisPage}&per_page=12`
      )
        .then(res => {
          if (res.ok) {
            this.setState({ status: 'idle' });
            return res.json();
          }
          this.setState({ status: 'idle' });
          return Promise.reject(new Error('Поиск не удался'));
        })
        .then(pictures => {
          this.setState({
            pictures: [...prevState.pictures, ...pictures.hits],
            totalPages: Math.ceil(pictures.totalHits / 12),
          });
          this.setState({ status: 'ok' });
        });
    }
  }

  render() {
    const { showModal } = this.state;
    // console.log(this.state.pictures);
    // console.log(this.state.page);
    // console.log(this.state.totalPages);
    if (this.state.pictures.length === 0) {
      return;
    }

    return (
      <div>
        <p>{this.props.onSearch}</p>
        {this.state.pictures && (
          <ul className="ImageGallery">
            {this.state.pictures.map(pic => (
              <li>
                <img
                  key={pic.id}
                  className="ImageGalleryItem-image"
                  src={pic.webformatURL}
                  width="300"
                  alt=""
                  large={pic.largeImageURL}
                  onClick={this.toggleModal}
                />
              </li>
            ))}
          </ul>
        )}
        {this.state.page < this.state.totalPages ? (
          <div className="Button-flex">
            <button className="Button" type="button" onClick={this.onLoadMore}>
              Load More
            </button>
          </div>
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
