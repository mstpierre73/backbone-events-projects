
// In the first few sections, we do all the coding here.
// Later, you'll see how to organize your code into separate
// files and modules.

//Créer le modèle
const Vehicule = Backbone.Model.extend({
    defaults: {
        make: "Toyota"
    }
});

//Créer une collection
const Vehicules = Backbone.Collection.extend({
    model: Vehicule
});

//Créer une vue pour un véhicule
const VehiculeView = Backbone.View.extend({
    tagName: "li",
    className: "vehicule",
    attributes: {
        "data-color": "blue"
    },

    initialize: function(options){
        this.bus = options.bus;
    },

    events: {
        "click .delete" : "onDelete"
    },

    onDelete: function(){
        this.remove();
    },

    render: function(){
        this.$el.html(this.model.get("registrationNumber") + " " + this.model.get("make") + " <button class='delete'>Delete</button>");
        this.$el.attr("id", this.model.id);
        return this;
    }
});

//Créer une vue pour la liste de véhicules
const VehiculesListView = Backbone.View.extend({
    tagName: "ul",

    initialize: function(options){
        this.bus = options.bus;
        bus.on("onVehiculeAdd", this.onVehiculeAdd, this);
    },

    onVehiculeAdd: function(registrationNumber){
        let vehicule = new Vehicule({registrationNumber: registrationNumber});
        let vehiculeView = new VehiculeView({ model: vehicule});
        this.$el.prepend(vehiculeView.render().$el);
    },

    render: function(){
        let self = this;

        this.model.each(function(vehicule){
            let vehiculeView = new VehiculeView({ model: vehicule, bus: self.bus});
            self.$el.append(vehiculeView.render().$el), this;
        });

        return this;
    }
});

//Créer une vue pour la zone d'ajout de texte
const NewVehiculeView = Backbone.View.extend({
    el: "#newview",

    initialize: function(options){
        this.bus = options.bus;
        this.bus.on("onVehiculeAdd", this.onVehiculeAdd, this);
    },

    events: {
        "click .add": "onClick",
    },

    onClick: function(){
        let input = this.$el.find(".registration-number");
        let registrationNumber = input.val();
        bus.trigger("onVehiculeAdd", registrationNumber);
        input.val("");
    },

    render: function(){
        this.$el.html("Add a new car registration number " + "<input type='text' class='registration-number'> <button class='add'>Add</button>" );
        return this;
    }
});

//Créer un agrégateur d'événements
let bus = _.extend({}, Backbone.Events);

//Créer une liste de véhicules
let vehiculeArray = new Vehicules([
    new Vehicule({id: 1, registrationNumber: "AAJ533", make: "Toyota"}),
    new Vehicule({id: 2, registrationNumber: "GRC123", make: "Honda"}),
    new Vehicule({id: 3, registrationNumber: "GLU456", make: "Ford"})
]);

//créer les vues pour l'affichage
let vehiculesListView = new VehiculesListView({el: "#container", model: vehiculeArray, bus: bus});
let newVehiculeView = new NewVehiculeView({bus: bus});
vehiculesListView.render();
newVehiculeView.render();