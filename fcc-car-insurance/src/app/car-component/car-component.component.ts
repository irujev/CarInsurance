import { AfterViewInit, Component, ElementRef, Input, ViewChild, HostListener } from '@angular/core';
import { Router} from "@angular/router";
import * as THREE from 'three-full';

@Component({
  selector: 'app-car-component',
  templateUrl: './car-component.component.html',
  styleUrls: ['./car-component.component.scss']
})
export class CarComponentComponent implements AfterViewInit {

  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private cameraTarget: THREE.Vector3;
  public scene: THREE.Scene;
  public loader: THREE.ColladaLoader;
  public router:Router;

  public fieldOfView: number = 60;
  public nearClippingPane: number = 1;
  public farClippingPane: number = 1100;

  public controls: THREE.OrbitControls;

  @ViewChild('canvas', {static: false})
  private canvasRef: ElementRef;

  constructor(router:Router) {
      this.render = this.render.bind(this);
      this.router = router;
      this.onModelLoadingCompleted = this.onModelLoadingCompleted.bind(this);
  }

  private get canvas(): HTMLCanvasElement {
      return this.canvasRef.nativeElement;
  }

  private createScene() {
    
      this.scene = new THREE.Scene();
      const textureLoader = new THREE.TextureLoader();
      const bgTexture = textureLoader.load('../assets/model/car_parking.jpg' );
      this.scene.background = bgTexture;
      this.loader = new THREE.ColladaLoader();
      this.loader.load('assets/model/ShelbyWD.dae', this.onModelLoadingCompleted);
      //////////////////////////////
      /////////////////////////////
  }

  private onModelLoadingCompleted(collada) {
      var modelScene = collada.scene;
      this.scene.add(modelScene);
      this.render();
  }

  private createLight() {
      var light = new THREE.PointLight(0xffffff, 1, 1000);
      light.position.set(0, 0, 100);
      this.scene.add(light);

      var light = new THREE.PointLight(0xffffff, 1, 1000);
      light.position.set(0, 0, -100);
      this.scene.add(light);
  }

  private createCamera() {
      let aspectRatio = this.getAspectRatio();
      this.camera = new THREE.PerspectiveCamera(
          this.fieldOfView,
          aspectRatio,
          this.nearClippingPane,
          this.farClippingPane
      );

      // Set position and look at
      this.camera.position.x = 10;
      this.camera.position.y = 10;
      this.camera.position.z = 100;
  }

  private getAspectRatio(): number {
      let height = this.canvas.clientHeight;
      if (height === 0) {
          return 0;
      }
      return this.canvas.clientWidth / this.canvas.clientHeight;
  }

  private startRendering() {
      this.renderer = new THREE.WebGLRenderer({
          canvas: this.canvas,
          antialias: true
      });
      this.renderer.setPixelRatio(devicePixelRatio);
      this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);

      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      this.renderer.setClearColor(0xffffff, 1);
      this.renderer.autoClear = true;

      let component: CarComponentComponent = this;

      (function render() {
          //requestAnimationFrame(render);
          component.render();
      }());
  }

  public render() {
      this.renderer.render(this.scene, this.camera);
  }

  public addControls() {
      this.controls = new THREE.OrbitControls(this.camera);
      this.controls.rotateSpeed = 1.0;
      this.controls.zoomSpeed = 1.2;
      this.controls.addEventListener('change', this.render);

  }

  /* EVENTS */

  public onMouseDown(event: MouseEvent) {
      console.log("onMouseDown");
      event.preventDefault();

      // Example of mesh selection/pick:
      var raycaster = new THREE.Raycaster();
      var mouse = new THREE.Vector2();
      mouse.x = (event.clientX / this.renderer.domElement.clientWidth) * 2 - 1;
      mouse.y = - (event.clientY / this.renderer.domElement.clientHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, this.camera);

      var obj: THREE.Object3D[] = [];
      this.findAllObjects(obj, this.scene);
      var intersects = raycaster.intersectObjects(this.scene.children, true );
      console.log("Scene has " + this.scene.children + " objects");
      console.log(intersects.length + " intersected objects found");
      console.log(intersects[0].object.name);
      this.router.navigate(['part/'+intersects[0].object.name]);
      //intersects.forEach((i) => {
     //     console.log(i.object); // do what you want to do with object
    //  });

  }

  private findAllObjects(pred: THREE.Object3D[], parent: THREE.Object3D) {
      // NOTE: Better to keep separate array of selected objects
      if (parent.children.length > 0) {
          parent.children.forEach((i) => {
              pred.push(i);
              this.findAllObjects(pred, i);                
          });
      }
  }

  public onMouseUp(event: MouseEvent) {
      console.log("onMouseUp");
  }


  @HostListener('window:resize', ['$event'])
  public onResize(event: Event) {
      this.canvas.style.width = "100%";
      this.canvas.style.height = "100%";
      console.log("onResize: " + this.canvas.clientWidth + ", " + this.canvas.clientHeight);

      this.camera.aspect = this.getAspectRatio();
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
      this.render();
  }

  @HostListener('document:keypress', ['$event'])
  public onKeyPress(event: KeyboardEvent) {
      console.log("onKeyPress: " + event.key);
  }

  /* LIFECYCLE */
  ngAfterViewInit() {
      this.createScene();
      this.createLight();
      this.createCamera();
      this.startRendering();
      this.addControls();
  }

}
