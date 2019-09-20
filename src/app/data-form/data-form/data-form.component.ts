import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl, Validators, FormBuilder} from "@angular/forms";
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';



@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.less']
})
export class DataFormComponent implements OnInit {

  formulario: FormGroup;

  constructor(
    private formBulider: FormBuilder,
    private http: HttpClient) { }


  ngOnInit() {
    /*this.formulario = new FormGroup({
      nome: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email])
    });*/

    this.formulario = this.formBulider.group({
      nome: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],

      endereco: this.formBulider.group({
        cep: [null, Validators.required],
        numero: [null, Validators.required],
        complemento: [null],
        rua: [null, Validators.required],
        bairro: [null, Validators.required],
        cidade: [null, Validators.required],
        estado: [null, Validators.required]
      })
    });
   
  }

    onSubmit() {
      console.log(this.formulario);
      this.http.post('https://httpbin.org/post', JSON.stringify(this.formulario.value))
      .subscribe(dados => { 
        console.log(dados); 
        //reset form 
        //this.resetar();
      }, 
      (error: any)=>alert('erro'));
        
    }
    
    //function for reset 
    resetar(){
      this.formulario.reset();
    }

    verificaValidTouched(campo: string){
      return !this.formulario.get(campo).valid && this.formulario.get(campo).touched; 
    }

    aplicaCssErro(campo: string){
      return{
        'has-error': this.verificaValidTouched(campo),
        'has-feedback': this.verificaValidTouched(campo) 
      }
    }

    consultaCEP(){

      let cep = this.formulario.get('endereco.cep').value;
      //Nova variável "cep" somente com dígitos.
       cep = cep.replace(/\D/g, '');

       //Verifica se campo cep possui valor informado.
       if (cep != "") {
         console.log('primeiro if')
         //Expressão regular para validar o CEP.
         var validacep = /^[0-9]{8}$/;
         //Valida o formato do CEP.
         if(validacep.test(cep)) {
          this.resetaDadosForm()

          this.http.get(`https://viacep.com.br/ws/${cep}/json/`)
          .subscribe(dados=>this.populaDadosForm(dados));
         }

       }
      
    }

    populaDadosForm(dados){

      this.formulario.patchValue({
        endereco:{
          rua: dados.logradouro,
          complemento: dados.complemento,
          bairro: dados.bairro,
          cidade: dados.localidade,
          estado: dados.uf
        }
      });

    }

    resetaDadosForm(){

      this.formulario.patchValue({
        endereco:{
          rua:null,
          complemento:null,
          bairro:null,
          cidade:null,
          estado:null
        }
      });
    }
 
 }
