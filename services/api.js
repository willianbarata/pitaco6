import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import xml2json from '@hendt/xml2json';
const parseString = require('react-native-xml2js').parseString;
var  analisador  = require ( 'xml2json-light' ) ; 
import XMLParser from 'react-xml-parser';
//import Globals from './../screens/Globals/Globals';
import Globals from './../screens/Globals/Globals'

const baseUrl = 'https://api.pitacosdacopa.com.br/bolao/ws-api';


const request = async (method, endpoint, params, token = null) => {
    method = method.toLowerCase();
    let fullUrl = `${baseUrl}${endpoint}`;
    let body = null;

    switch(method){
        case 'get':
            let queryString = new URLSearchParams(params).toString();
            fullUrl += `?${queryString}`;
        break;
        case 'post':
        case 'put':
        case 'delete':
            body = JSON.stringify(params);
        break;
    }

    let headers = {'Content-Type' : 'application/json'};
    if(token){
        headers.Authorization = `Bearer ${token}`;
    }

    let req = await fetch(fullUrl, { method, headers, body });
    let json = await req.json();
    return json;
}

const post = async (param) => {
    const x = axios.post('https://api.pitacosdacopa.com.br/bolao/ws-api?wsdl', param, {
                    headers: {'Content-Type': 'text/xml'}
                })
                .then(function (res) {
                    return res;
                })
                .catch(function (error) {
                   // console.log(error);
                });
    const y = await x;
    
    return y.data;
}

const postPalpite = async (param) => {
    const x = axios.post('https://api.pitacosdacopa.com.br/bolao/ws-api?wsdl', param, {
                    headers: {'Content-Type': 'text/xml'}
                })
                .then(function (res) {
                    
                    return res;
                })
                .catch(function (error) {
                   //console.log(error);
                });
    const y = await x;
    console.log(y.data)
    return y.status;
}


export default {
    getToken: async () => {
        return await AsyncStorage.getItem('token');
    },
    validateToken: async () => {
        let token = await AsyncStorage.getItem('token');
        let json = await request('post', '/auth/validade', {}, token);
        return json;
    },
    login: (lista) => {//listar infousu
        let xmls='<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">' +
        '<Body>' +
        '<ObterInfoUsuarioRQ xmlns="http://soap.webservices/" Usuario="' + Globals.login +'" Senha="'+ Globals.password + '"/>'  +
        //'<ObterInfoUsuarioRQ xmlns="http://soap.webservices/" Usuario="william.santos@riosoft.com.br" Senha="12345678"/>' +
        '</Body>' +
        '</Envelope>';
        
        return post(xmls).then((resp) => {
            return new Promise((resolve, reject) => {
                
                var json = xml2json(resp); 
                json = json["S:Envelope"]["S:Body"]["ns2:ObterInfoUsuarioRS"];
                json = JSON.stringify(json)
                resolve(json)

                return json;
            })
        });
        
    },

    loginAuth: (lista) => {//listar infousu
        

        console.log(Globals.login)
        let xmls='<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">' +
        '<Body>' +
        //'<ObterInfoUsuarioRQ xmlns="http://soap.webservices/" Usuario="william.santos@riosoft.com.br" Senha="12345678"/>' +
        '<ObterInfoUsuarioRQ xmlns="http://soap.webservices/" Usuario="' + Globals.login +'" Senha="'+ Globals.password + '"/>'  +
        '</Body>' +
        '</Envelope>';
        
        return post(xmls).then((resp) => {
            return new Promise((resolve, reject) => {
                
                var json = xml2json(resp); 
                json = json["S:Envelope"]["S:Body"]["ns2:ObterInfoUsuarioRS"]["Resposta"]["_@attribute"];
                json = JSON.stringify(json);
                resolve(json);
                
                //onsole.log(json)

                return json;
            })
        });
        
    },

    listapalpite: (email) => {
        let xmls='<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">' +
        '<Body>' +
        //'<ListarPalpitesRQ xmlns="http://soap.webservices/"  Usuario="william.santos@riosoft.com.br" Senha="12345678"/>' +
        '<ListarPalpitesRQ xmlns="http://soap.webservices/"  Usuario="' + Globals.login +'" Senha= "'+ Globals.password + '"/>' +
        '</Body>' +
        '</Envelope>';
        //console.log("Chamou Lista Palpite")
        return post(xmls).then( (resp) =>{
            return new Promise((resolve, reject) => {
                var json = xml2json(resp); 
                
                var obj = new Object();
                obj.jogos = json["S:Envelope"]["S:Body"]["ns2:ListarPalpitesRS"]["PalpitesJogos"]["Jogo"]
               
                obj.palpite = json["S:Envelope"]["S:Body"]["ns2:ListarPalpitesRS"]["PalpitesJogos"]["Jogo"]["Palpite"]
                var Arrayjsongp = json["S:Envelope"]["S:Body"]["ns2:ListarPalpitesRS"]["PalpitesJogos"]["Jogo"]
                
                

                //console.log('Tamanho Array')
                //console.log(Arrayjsongp.length)
                /* console.log("teste 1")

                for(var i = 0; i <= Arrayjsongp.length - 1; i++ ){
                    if (typeof Arrayjsongp[i].Palpite != 'undefined') {
                        //obj.palpite = Arrayjsongp[i].Palpite
                       // console.log('obj.palpite')
                       // console.log(obj.palpite)
                    }                     
                }
                 */
                //console.log(json["S:Envelope"]["S:Body"]["ns2:ListarPalpitesRS"]["PalpitesJogos"])
                var jsongp = json["S:Envelope"]["S:Body"]["ns2:ListarPalpitesRS"]["PalpitesJogos"]["Jogo"]
                
                
                //console.log(obj.palpite)
                jsongp = JSON.stringify(jsongp)
                
                resolve(jsongp)
                
                return jsongp;
            });
        });
        
    },

    listarestatistica: (email) => {
        let xmls=
        '<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">' +
        '<Body>' +
        //'<ObterEstatisticasJogoRQ xmlns="http://soap.webservices/" Usuario="william.santos@riosoft.com.br" Senha="12345678"/>' +
        '<ObterEstatisticasJogoRQ xmlns="http://soap.webservices/" Usuario="' + Globals.login +'" Senha= "'+ Globals.password + '"/>' +
        '<CodigoJogo xmlns="">382</CodigoJogo>' +
        '</ObterEstatisticasJogoRQ>' +
        '</Body>' +
        '</Envelope>';
        
        //console.log(xmls)
        post(xmls).then(function (resp) {
            var json = xml2json(resp);

            var jsongp = json["S:Envelope"]["S:Body"]["ns2:ObterEstatisticasJogoRS"]["Estatisticas"]["Estatistica"];
            JSON.stringify(jsongp)
          //  console.log(jsongp); //TODO: listados todas estatisticas falta ordenar na tela

            
        });
        
    },


    listarjogos: (lista) => {
        let xmls=
        '<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">' + //Usuario="william.santos@riosoft.com.br" Senha="12345678"/>
        '<Body>' +
        //'<ListarJogosRQ xmlns="http://soap.webservices/"  Usuario="william.santos@riosoft.com.br" Senha="12345678"/>' +
        '<ListarJogosRQ xmlns="http://soap.webservices/"  Usuario="' + Globals.login +'" Senha= "'+ Globals.password + '"/>' +
        '</Body>' +
        '</Envelope>';
       return post(xmls).then( (resp) =>{
            return new Promise((resolve, reject) => {
                var json = xml2json(resp);    
                jsongp = json["S:Envelope"]["S:Body"]["ns2:ListarJogosRS"]["Jogos"]["Jogo"]
                
                jsongp = JSON.stringify(jsongp)
              //  lista = resolve["S:Envelope"]["S:Body"]["ns2:ListarJogosRS"]["Jogos"]["Jogo"];
                resolve(jsongp)
                
                return jsongp;
            });
        });
    },

    listarclassificacao: ( ) => {
        let xmls=
        '<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">' +
        '<Body>' +
        //'<ListarClassificacaoRQ xmlns="http://soap.webservices/" Usuario="william.santos@riosoft.com.br" Senha="12345678"/>'  +
        '<ListarClassificacaoRQ xmlns="http://soap.webservices/" Usuario="' + Globals.login +'" Senha= "'+ Globals.password + '"/>'  +
        '</Body>' +
        '</Envelope>'


        return post(xmls).then( (resp) =>{
            return new Promise((resolve, reject) => {

            
                var json = new XMLParser().parseFromString(resp);
                console.log('--------------json---------------')
                //console.log(json)
                var posicaoUsu = json["children"][0]["children"][0]["children"][2]
                var obj = json["children"][0]["children"][0]["children"][2]["children"]
                obj = JSON.stringify(obj)
                console.log(obj)

                /* var textoPosicao1 = `<Posicoes Tipo="GRUPO"`
                var textoPosicao2 = `</Posicoes><Posicoes`

                var posicao1 = obj.indexOf(textoPosicao1)
                var posicao2 = obj.indexOf(textoPosicao2)
                 var xmlComPosicao = obj.substring(posicao1, posicao2)

                
                var xmlConvertido = new XMLParser().parseFromString(xmlComPosicao); 

                xmlConvertidoString = JSON.stringify(xmlConvertido) */
                
                resolve(obj)
                console.log(xmlConvertidoString)
                return obj;
            });
        });
        
    },



                palpitarjogo: (codJogo, golTime1, golTime2) => { //erro 500
                

                    let xmls=
                '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:soap="http://soap.webservices/">'+
            '<soapenv:Header/>'+
            '<soapenv:Body>'+
                '<soap:PalpitarJogoRQ Usuario="' + Globals.login +'" Senha= "'+ Globals.password +'">'+
                //'<soap:PalpitarJogoRQ Usuario="william.santos@riosoft.com.br" Senha="12345678"/>'+
                    '<CodigoJogo>'+ codJogo +'</CodigoJogo>'+
                    '<GolsTime1>'+ golTime1 +'</GolsTime1>'+
                    '<GolsTime2>'+ golTime2 +'</GolsTime2>'+
                '</soap:PalpitarJogoRQ>'+
            '</soapenv:Body>'+
            '</soapenv:Envelope>'

                return postPalpite(xmls).then( (resp) =>{
                        return new Promise((resolve, reject) => {
                            //var json = xml2json(resp);  
                            //var jsongp = JSON.stringify(json);
                            //resolve(jsongp)
                            //console.log(jsongp) 
                    });
                }) 
                },

            }

