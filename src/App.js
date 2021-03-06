import React, { Component } from 'react';
import Layout from './hoc/Layouts/Layout';
import WasteItemList from './components/WasteItemList/WasteItemList'
import Backdrop from './components/UI/Backdrop/Backdrop'
import axios from './services/axios-waste'
import Modal from './components/UI/Modal/Modal'
import classes from './App.css'
class App extends Component {
  state = {
    list: [],
    favorites: [],
    items: [],
    loading: false,
    showModal: false,
    modalTitle: "",
    modalText: ""
  }

  getJson = (text) => {
    if (text.trim() === "") {
      this.setState({ list: [] })
      return
    }

    this.setState({ loading: true })
    axios.get("").then(success => {
      let items = success.data.map((item, index) => {
        if (!item.id) {
          item.id = index
        }
        if (this.state.favorites.findIndex(f => f.id === item.id) !== -1)
          item.favorite = true
        return item
      })
      let list = items.filter(item => {
        let keywords = item.keywords.split(', ')
        let found = keywords.filter(v => v.toUpperCase().includes(text.toUpperCase()))
        return found.length > 0
      })
      if(list.length === 0){
        this.setState({
          modalTitle: "No Results",
          modalText: "This search result is empty. No matching keyword found.",
          showModal: true,

        })
      }
      this.setState({ items: items, list: list })
      this.setState({ loading: false })
    }).catch(error => {
      this.setState({ loading: false })
      console.log(error)
    })
  }

  addFavoriteHandler = (id) => {
    let favorites = this.state.favorites
    let items = this.state.list
    let index = items.findIndex(item => item.id === id)
    items[index].favorite = !items[index].favorite
    favorites.push(items[index])
    this.setState({ favorites: favorites })
  }

  removeFavoriteHandler = (id) => {
    let favorites = this.state.favorites
    let items = this.state.list
    let index = favorites.findIndex(item => item.id === id)
    let indexItem = items.findIndex(item => item.id === id)
    if(indexItem !== -1)
    items[indexItem].favorite = !items[indexItem].favorite
    favorites.splice(index, 1)
    this.setState({ favorites: favorites, list: items })
  }
  modalClosedHandler = () =>{
    this.setState({showModal: false})
  }
  render() {
    return (
      <Layout search={this.getJson}>
        <Backdrop show={this.state.loading} loader={true} />
        <Modal show={this.state.showModal} modalClosed={this.modalClosedHandler}>
                    <div 
                      className={classes.ModalTitle}><strong> {this.state.modalTitle}</strong><br/></div>
                    {this.state.modalText}
        </Modal>
        <WasteItemList list={this.state.list} addFavoriteHandler={this.addFavoriteHandler} removeFavoriteHandler={this.removeFavoriteHandler} />
        <WasteItemList list={this.state.favorites} addFavoriteHandler={this.addFavoriteHandler} removeFavoriteHandler={this.removeFavoriteHandler} title="Favourites" />
      </Layout>
    );
  }
}

export default App;
