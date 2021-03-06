import { Component, OnInit, Input } from '@angular/core';
import { ProdProv } from '../models/prod-prov';
import { Provider } from '../models/provider';
import { Product } from '../models/product';
import { ProviderService } from '../provider.service';
import { ProdProvService } from '../prodprov.service';
import { ProductService } from '../product.service';
import { ShoppingCartService } from "../shopping-cart-services/shopping-cart.service";
import { ActivatedRoute } from '@angular/router';
import { FileUploader, FileUploaderOptions } from 'ng2-file-upload'; 
import { Router } from '@angular/router';
import { AuthenticationService } from '../guard-services/authentication.service';
import { Headers } from '@angular/http/src/headers';
import { ShoppingCart } from '../models/shopping-cart';

@Component({
  selector: 'app-prodprov-form',
  templateUrl: './prodprov-form.component.html',
  styleUrls: ['./prodprov-form.component.css']
})

export class ProdprovFormComponent implements OnInit {

  @Input() typeForm: any;
  @Input() prodprov: ProdProv;
  providers : Provider[];
  products : Product[];
  newprodprov = { _id: ''};
  uploadImage = 0;
  uploadSuccess = 0;
  public uploader:FileUploader;
  uploadProdProv = 0;


  constructor(private providerService: ProviderService,
              private prodprovService: ProdProvService,
              private productService: ProductService,
              private authService: AuthenticationService,
              private shoppingCartService: ShoppingCartService,
              private route: ActivatedRoute,
              private router: Router) {}

  ngOnInit() {
    this.providerService.getProviders()
    .subscribe(providers => this.providers = providers);

    this.productService.getProducts()
    .subscribe(products => this.products = products);

    if(this.prodprov != null){
      this.newprodprov = this.prodprov;
    };

  }

  saveProdProv(){
    this.prodprovService.addProduct(this.newprodprov as ProdProv)
    .subscribe(
      data => {this.setImageUrl(data.data._id);
               this.uploadImage = 1;
               this.uploadSuccess = 0;
               this.uploadProdProv = 1;
               this.shoppingCartService.updateProdProvs();
      },
      error => alert(error)
    );
  }

  setImageUrl(_id:any){
    
    //
    let URL = 'http://localhost:3000/api/prodprov/new/'+_id+"/image"
    this.uploader = new FileUploader({url: URL});

    // Adding token to FileUpload Headers
    var options: FileUploaderOptions = {};
    let token = this.authService.retrieve();
    options.headers = [{ name: 'x-access-token', value : token } ]
    this.uploader.setOptions(options);

    this.uploader.options.headers['x-access-token'] = 

    this.uploader.onAfterAddingFile = (file) => {file.withCredentials = false; };
    
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
          console.log("ImageUpload:uploaded", item, status, response);
          this.uploadSuccess = 1;
          this.uploadImage = 0;
    };
  }

  updateProdProv(){
    this.newprodprov._id = this.prodprov._id;
    this.prodprovService.updateProduct(this.newprodprov as ProdProv)
    .subscribe(
      data => {
               this.setImageUrl(this.newprodprov._id);
               this.uploadImage = 1;
               this.uploadSuccess = 0;
               this.uploadProdProv = 1;
      },
      error => alert(error)     
    );
  }

  deleteProdProv(){
    this.prodprovService.deleteProduct(this.prodprov)
    .subscribe(
      data => {
        this.uploadSuccess = 1;
        this.uploadProdProv = 1;
      },
      error => alert(error)
    )
  }

  goBack(){
    this.router.navigate(["/dashboard"]);
  }

  refresh(){
    location.reload();
  }
}
