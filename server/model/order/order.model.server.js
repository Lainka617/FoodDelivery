var mongoose = require('mongoose');
var restaurantModel = require("../restaurant/restaurant.model.server");
var orderSchema = require('./order.schema.server');
var orderModel = mongoose.model("order",orderSchema);


orderModel.createOrder = createOrder;
orderModel.findAllPagesForWebsite = findAllPagesForWebsite;
orderModel.findPageById = findPageById;
orderModel.updatePage = updatePage;
orderModel.deletePage = deletePage;

module.exports = orderModel;

function createOrder(websiteId,page) {
    console.log('Mongoose: createPage() called');
    // first, create the order with the name, description, date, etc.
    return pageModel.create(page)
        .then(function (responsePage) {
            // next, for the current restaurant, push this order into restaurant's order list.
            websiteModel.findWebsiteById(websiteId)
                .then(function (website) {
                    website.pages.push(responsePage);
                    return website.save();
                });
            return responsePage;
        });
}

function findAllPagesForWebsite(websiteId) {
    console.log('Mongoose: findAllPagesForWebsite() called');
    return pageModel.find({_website: websiteId})
        .populate('_website', '_id');      // Do not append all the restaurant info here. Just populate restaurant with its id.

}

function findPageById(pageId) {
    console.log('Mongoose: findPageById() called: ' + pageId);
    return pageModel.findOne({_id: pageId});
}

function updatePage(pageId, page) {
    console.log('Mongoose: updatePage() called');
    return pageModel.updateOne({_id: pageId}, page);
}

function deletePage(websiteId, pageId) {
    console.log('Mongoose: deletePage() called');
    // first, find the original order
    pageModel.findOne({_id: pageId})
        .then(function (responsePage) {
            // next, for the current restaurant, delete this order from restaurant's order list.
            websiteModel.findWebsiteById(websiteId)
                .then(function (website) {
                    website.pages.pull({ _id: responsePage._id });
                    return website.save();
                });
            return responsePage;
        });
    // then, delete this order
    return pageModel.deleteOne({_id: pageId});


}
