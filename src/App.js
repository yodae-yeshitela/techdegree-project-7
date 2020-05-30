import React, {Component} from 'react';
import {
  BrowserRouter, 
  Route,
  Switch,
  Redirect} from 'react-router-dom'
import Gallery from './components/Gallery';
import SearchForm from './components/SearchForm';
import Nav from './components/Nav';
import apiKey from './config'
import PageNotFound from './components/PageNotFound';

class App extends Component {  
  state = {
    carPhotos: [],
    rainbowPhotos: [],
    sunsetPhotos: [],
    searchResults:[],
    isLoading: true
  }
  api = `&api_key=${apiKey}&`
  flickrUrl = `https://www.flickr.com/services/rest/?method=flickr.photos.search&per_page=24&format=json&nojsoncallback=1`
  formatImageUrl = ( {farm, server, id, secret}) =>`https://farm${farm}.staticflickr.com/${server}/${id}_${secret}.jpg`
  
  fetchPhotos = (searchTerm) =>{
    let searchUrl=`${this.flickrUrl}${this.api}&tags=${searchTerm}&page=1`;
    return fetch(searchUrl)
      .then(data=> data.json())
      .then(data => data.photos.photo)
      .then( data=> data.map(this.formatImageUrl))
  }

  componentDidMount(){
    Promise.all(
      [
        this.fetchPhotos('cars'),
        this.fetchPhotos('rainbow'),
        this.fetchPhotos('sunset')
      ]
    ).then(data => {
      this.setState({carPhotos: data[0]});
      this.setState({rainbowPhotos: data[1]});
      this.setState({sunsetPhotos: data[2]});
      this.setState({isLoading: false})
    })
  }
  
  searchPhotos = (searchTerm) =>{
    this.setState({isLoading: true});
    this.fetchPhotos(searchTerm)
      .then(photos => this.setState({searchResults: photos}))
      .then(()=> this.setState({isLoading: false}));
  }

  render(){
    return (
      <BrowserRouter>
        <Route render={(props)=><SearchForm {...props} searchPhotos = {this.searchPhotos}/>} />
        <Nav/>
        <Switch>
          <Route exact path='/' render={()=><Redirect to='/cars'/>}/>
          <Route path='/cars' render={(props) => <Gallery title='Cars'  isLoading = {this.state.isLoading} photos={this.state.carPhotos}/>}></Route>
          <Route path='/rainbow' render={(props) => <Gallery title='Rainbow' isLoading = {this.state.isLoading} photos={this.state.rainbowPhotos}/>} ></Route>
          <Route path='/sunset' render={(props) => <Gallery title='Sunset' isLoading = {this.state.isLoading} photos={this.state.sunsetPhotos}/>}></Route>
          <Route 
            path='/search/:searchTerm' 
            render={(props) => 
            <Gallery
                {...props}
                searchPhotos = {this.searchPhotos} 
                isLoading = {this.state.isLoading} 
                title={`Search results for: ${props.match.params.searchTerm}`} 
                photos={this.state.searchResults}
                />
              }
            />
          <Route path="/notfound" component={PageNotFound}/>
          <Route render={()=><Redirect to='/notfound'/>}/>
        </Switch>
      </BrowserRouter>
    );
  }
}
export default App;