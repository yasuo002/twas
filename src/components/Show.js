import React from 'react';
import { StyleSheet, Platform, Image, Text, View, ScrollView, BackHandler,Clipboard, TextInput, ToastAndroid, TouchableOpacity, Dimensions } from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { Button } from 'react-native-elements';
import InputScrollView from 'react-native-input-scroll-view';
import { Icon } from 'react-native-elements';
import firebase from 'react-native-firebase';
import Hyperlink from 'react-native-hyperlink';

export default class Show extends React.Component {
  state = { not: this.props.navigation.state.params.data, 
  currentUser : null,
  text: '',
  textareaHeight: null,
  noteBgColor:this.props.navigation.state.params.noteBgColor,
  noteTitle:this.props.navigation.state.params.noteTitle,
  isEdit:true,
  editIcon:"toggle-off",
}


  update = () =>{
    const { not }       = this.state;

    const { currentUser } = firebase.auth();
    this.setState({ currentUser });
   const mail = currentUser.email;
   const noteItemKey = this.props.navigation.state.params.notkey;
   const noteTitle = this.state.noteTitle;

   const ref ="Users/"+currentUser.uid+"/"+noteItemKey;
    firebase.database().ref(ref).update({
        not:this.state.not,
        noteTitle:this.state.noteTitle,
        noteBgColor:this.state.noteBgColor,
    }).then((data)=>{
        //success callback
       //alert("Başarılı");
       this.props.navigation.navigate('Main');
    }).catch((error)=>{
        //error callback
        alert(error);
    })
}

editOrRead=()=>{
  const textareaHeight = this.state.textareaHeight;
  if(this.state.isEdit)
  {
    return (
      <ScrollView>
            <InputScrollView>        
            <TextInput style={{ height: textareaHeight, backgroundColor:this.state.noteBgColor, maxHeight:500, fontSize:18 }}
                       value={this.state.not}
                       placeholder={"Not Gir"}
                       ref={(input) => { this.not = input; }}
                       onChangeText={not => this.setState({ not })}
                       onContentSizeChange={this._onContentSizeChange}
                       multiline={true} />
      	</InputScrollView>
        </ScrollView>
    )
  }
  else {
    return(
      <ScrollView>
           <Hyperlink
    linkStyle={ { color: '#2980b9', fontSize: 18 } }
    linkDefault={true}
    linkText={ url => url === 'www.instagram.com/fridayteam23' ? 'Friday Team' : url }
   >
    <Text style={{fontSize:18, marginTop:10, marginLeft:4}}>
     {this.state.not}
    </Text>
  </Hyperlink>
  </ScrollView>
    )
  }
}

checkEditStatus=()=>{
  if(this.state.isEdit)
  {
   this.setState({isEdit:false, editIcon:'toggle-on'});
   ToastAndroid.show('Okuma Modu Açık', ToastAndroid.SHORT);
  }
     else
     {
       this.setState({isEdit:true, editIcon:'toggle-off'});
       ToastAndroid.show('Okuma Modu Kapalı', ToastAndroid.SHORT);
     }
}


_onContentSizeChange = ({nativeEvent:event}) => {
  this.setState({ textareaHeight: event.contentSize.height });
};
static navigationOptions = {
         
  title: 'Not Güncelle',
  headerStyle: {
  backgroundColor: '#8c52ff'
  },
  headerTintColor: '#fff',
 /* header: null*/
};


//Geri Tuşuna Basıldığında update() fonksiyonu çalışır START
onButtonPress = () => {
  BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  // then navigate
  //navigate('NewScreen');
}

handleBackButton = () => {
  this.update();
//BackHandler.exitApp();
 } 


 componentDidMount() {
  BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
}

componentWillUnmount() {
  BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
}
//Geri Tuşuna Basıldığında update() fonksiyonu çalışır END

//Metni Panoya Kopyalama START
_setContent=async(text)=> {
 // await Clipboard.setString(text);
 await Clipboard.setString(this.state.not);
 ToastAndroid.show('Not Panoya Kopyalandı', ToastAndroid.SHORT);
}
//Metni Panoya Kopyalama END

  render() {
    const { text, textareaHeight } = this.state;
    return (
      <View style={{  flex: 1,
        backgroundColor:this.state.noteBgColor}}>
        
        <TextInput style={styles.notetitle}
        placeholder ="Not Başlığı....."
        editable = {true}
        maxLength = {50}
        value={this.state.noteTitle}
        returnKeyType={"next"}
        onSubmitEditing={() => { this.not.focus(); }}
     //   autoFocus = {true}   
        onChangeText={(noteTitle) => this.setState({noteTitle})}
      />
  <View style={{borderBottomColor:'gray',
  borderBottomWidth:1,}} />

   

        {this.editOrRead()}

      <View style={{flexDirection: 'row', backgroundColor:this.state.noteBgColor, zIndex:50}}>
       <TouchableOpacity style={{     width:Dimensions.get('window').width /3,  backgroundColor:this.state.noteBgColor, }} 
       onPress={this.update}>
      <Icon
        name="update"
        type='material'
        color="black"
        size={23}
      />
       </TouchableOpacity>

       <TouchableOpacity style={{width:Dimensions.get('window').width /3, backgroundColor:this.state.noteBgColor,marginBottom:2}} 
       onPress={this._setContent}>
      <Icon
        name='clone'
        type='font-awesome'
        color="black"     
        size={23}
      />
       </TouchableOpacity>

       <TouchableOpacity style={{width:Dimensions.get('window').width /3, backgroundColor:this.state.noteBgColor,}} 
       onPress={this.checkEditStatus}>
      <Icon
        name={this.state.editIcon}
        type='font-awesome'
        color="black"
        size={23}
      />
       </TouchableOpacity>
        </View>

        <View style={{ flexDirection: 'row', backgroundColor:'white', borderColor:'white', borderWidth:2, zIndex:50}}>
          {/*
      <TouchableOpacity onPress={()=>this.setState({ noteBgColor:'#e38923'}) } ><View style={{borderRadius:600,width: Dimensions.get('window').width / 8, height: 50, backgroundColor: '#e38923'}} /></TouchableOpacity>
      <TouchableOpacity onPress={()=>this.setState({ noteBgColor:'#72e0d9'}) } ><View style={{borderRadius:600, width: Dimensions.get('window').width / 8, height: 50, backgroundColor: '#72e0d9'}} /></TouchableOpacity>
      <TouchableOpacity onPress={()=>this.setState({ noteBgColor:'#ffffb3'}) } ><View style={{borderRadius:600,width: Dimensions.get('window').width / 8, height: 50, backgroundColor: '#ffffb3'}} /></TouchableOpacity>
      <TouchableOpacity onPress={()=>this.setState({ noteBgColor:'#f9ddd6'}) } ><View style={{borderRadius:600,width: Dimensions.get('window').width / 8, height: 50, backgroundColor: '#f9ddd6'}} /></TouchableOpacity>
      <TouchableOpacity onPress={()=>this.setState({ noteBgColor:'#92374d'}) } ><View style={{borderRadius:600,width: Dimensions.get('window').width / 8, height: 50, backgroundColor: '#92374d'}} /></TouchableOpacity>
      <TouchableOpacity onPress={()=>this.setState({ noteBgColor:'#f6aa1c'}) } ><View style={{borderRadius:600,width: Dimensions.get('window').width / 8, height: 50, backgroundColor: '#f6aa1c'}} /></TouchableOpacity>
      <TouchableOpacity onPress={()=>this.setState({ noteBgColor:'#14e2af'}) } ><View style={{borderRadius:600,width: Dimensions.get('window').width / 8, height: 50, backgroundColor: '#14e2af'}} /></TouchableOpacity>
      <TouchableOpacity onPress={()=>this.setState({ noteBgColor:'#dabfff'}) } ><View style={{borderRadius:600,width: Dimensions.get('window').width / 8, height: 50, backgroundColor: '#dabfff'}} /></TouchableOpacity>
          */}

      <TouchableOpacity onPress={()=>this.setState({ noteBgColor:'#FFFFFF'}) } ><View style={{width: Dimensions.get('window').width / 8, height: 50, backgroundColor: '#FFFFFF'}} /></TouchableOpacity>
      <TouchableOpacity onPress={()=>this.setState({ noteBgColor:'#95B3D7'}) } ><View style={{width: Dimensions.get('window').width / 8, height: 50, backgroundColor: '#95B3D7'}} /></TouchableOpacity>
      <TouchableOpacity onPress={()=>this.setState({ noteBgColor:'#D99694'}) } ><View style={{width: Dimensions.get('window').width / 8, height: 50, backgroundColor:'#D99694'}} /></TouchableOpacity>
      <TouchableOpacity onPress={()=>this.setState({ noteBgColor:'#14E2AF'}) } ><View style={{width: Dimensions.get('window').width / 8, height: 50, backgroundColor: '#14E2Af'}} /></TouchableOpacity>
      <TouchableOpacity onPress={()=>this.setState({ noteBgColor:'#DABFFF'}) } ><View style={{width: Dimensions.get('window').width / 8, height: 50, backgroundColor: '#DABFFF'}} /></TouchableOpacity>
      <TouchableOpacity onPress={()=>this.setState({ noteBgColor:'#FAC08F'}) } ><View style={{width: Dimensions.get('window').width / 8, height: 50, backgroundColor: '#FAC08F'}} /></TouchableOpacity>
      <TouchableOpacity onPress={()=>this.setState({ noteBgColor:'#FFFF99'}) } ><View style={{width: Dimensions.get('window').width / 8, height: 50, backgroundColor: '#FFFF99'}} /></TouchableOpacity>
      <TouchableOpacity onPress={()=>this.setState({ noteBgColor:'#C0C0C0'}) } ><View style={{width: Dimensions.get('window').width / 8, height: 50, backgroundColor: '#C0C0C0'}} /></TouchableOpacity>
      </View>  
</View>
    );
  }
}


const styles = StyleSheet.create({
  noteTexta: {
    /* textAlignVertical: 'top',*/
     flex: 1, padding: 4, 
     marginRight: 1, 
     marginTop: 5, 
     fontSize: 18, 
     borderWidth: 1, 
     borderRadius: 4, 
     borderColor: 'white', 
     backgroundColor: '#db3434',
    
     height: 150,
     width :280
      
   },
 
 
   notetitle:{
     fontSize:30,
     marginLeft:10,
     fontWeight: 'bold'
   },
   
   savecontainer:{
     flexDirection:'row',
     marginBottom: 1,
     width:40,
     marginLeft: Dimensions.get('window').width / 2-40 ,
 
   },
 
   savebutton:{
    // borderWidth:2,
     width:Dimensions.get('window').width /3,
    
     backgroundColor:'#fff', 

   }
});
 
