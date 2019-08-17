<template>
    <div style="margin-bottom: 20px">
        <header>
            <div class="container"><a href="/" class="header__logo-link"><img class="header__logo-img"
                                                                              src="https://seatplan.com/images/logo/seatplanlogo_white.svg"
                                                                              alt="SeatPlan Logo"></a>
                <div role="search">
                    <form class="nav-search">
                        <fieldset>
                            <span class="algolia-autocomplete"
                                        style="position: relative; display: inline-block; direction: ltr;">
                                <input
                                class="algolia-autocomplete algolia-autocomplete-site-header algolia-autocomplete-site-header-desktop aa-hint"
                                autocomplete="off" value="" readonly="" aria-hidden="true" spellcheck="false"
                                tabindex="-1"
                                style="position: absolute; top: 0px; left: 0px; border-color: transparent; box-shadow: none; opacity: 1; background: none 0% 0% / auto repeat scroll padding-box border-box rgb(2, 87, 130);"><input
                                class="algolia-autocomplete algolia-autocomplete-site-header algolia-autocomplete-site-header-desktop aa-input"
                                placeholder="Search show or venue" name="q" autocomplete="off" value=""
                                spellcheck="false" role="combobox" aria-autocomplete="both" aria-expanded="false"
                                aria-owns="algolia-autocomplete-listbox-0" dir="auto"
                                style="position: relative; vertical-align: top; background-color: transparent;">
                                </span>
                        </fieldset>
                    </form>
                </div>
            </div>
        </header>
        <section class="section-hero">
            <div class="section-container"><h1>Add Photo Form</h1>
                <p>Each photo added to a review earns 40 rewards points</p></div>
        </section>
        <div class="container">
            <div class="form-group row">
                <label class="col-sm-2 col-form-label">Venue</label>
                <input v-validate="'required'" name="Venue" id="input1" class="form-control col-sm-4" type="text"
                       placeholder="Type to search...">
                <typeahead v-model="selectedVenue" target="#input1" append-to-body open-on-empty force-select
                           :data="this.dummyData" item-key="venue"/>
                <span>{{ errors.first('Venue') }}</span>
            </div>
            <div class="form-group row">
                <label class="col-sm-2 col-form-label">Section</label>
                <select v-validate="'required'" name="Section" class="form-control col-sm-2"
                        v-model="selectedSection">
                    <option disabled selected>Select section</option>
                    <option v-for="s in sectionList" v-bind:value="s">{{s.section}}</option>
                </select>
                <span>{{ errors.first('Section') }}</span>
            </div>
            <div class="form-group row">
                <label class="col-sm-2 col-form-label">Row</label>
                <select class="form-control col-sm-2" v-model="selectedRow">
                    <option disabled value="">Select row</option>
                    <option v-for="r in rowList" v-bind:value="r">{{r.row}}</option>
                </select>
            </div>
            <div class="form-group row">
                <label class="col-sm-2 col-form-label">Seat</label>
                <select class="form-control col-sm-2" v-model="selectedSeat">
                    <option disabled value="">Select seat</option>
                    <option v-for="s in seatList" v-bind:value="s">{{s}}</option>
                </select>
            </div>
            <div class="form-group row">
                <label class="col-sm-2 col-form-label">Date of visit</label>
                <date-picker class="col-sm-2" placeholder="DD/MM/YYYY h:mm" v-model="visitDate"
                             :config="dateOptions"></date-picker>
            </div>
            <div class="form-group row">
                <label class="col-sm-2 col-form-label">Comfort</label>
                <star-rating v-model="comfortRating" :star-size="20" :borderWidth="1"></star-rating>
            </div>
            <div class="form-group row">
                <label class="col-sm-2 col-form-label">Legroom</label>
                <star-rating v-model="legRoomRating" :star-size="20" :borderWidth="1"></star-rating>
            </div>
            <div class="form-group row">
                <label class="col-sm-2 col-form-label">View</label>
                <star-rating v-model="viewRating" :star-size="20" :borderWidth="1"></star-rating>
            </div>
            <div class="form-group row">
                <label class="col-sm-2 col-form-label">Seat Comment</label>
                <textarea v-model="comment" class="col-sm-4 form-control" autocomplete="off" rows="4"
                          placeholder="Could you see all of the stage? Were you comfortable? Good legroom?"></textarea>
            </div>
            <div class="form-group row">
                <label class="col-sm-2 col-form-label">Photo</label>
                <input type="file" name="image" accept="image/*" class="btn btn-secondary"
                       @change="setImage"/>
            </div>
            <div class="form-group row" v-if="imgSrc">
                <div class="col-sm-5">
                    <vue-cropper
                            ref='cropper'
                            :guides="true"
                            :view-mode="2"
                            drag-mode="crop"
                            :auto-crop-area="0.5"
                            :min-container-width="250"
                            :min-container-height="180"
                            :background="true"
                            :rotatable="true"
                            :src="imgSrc"
                            alt="Source Image"
                            :img-style="{ 'width': '400px', 'height': '300px' }">
                    </vue-cropper>
                </div>
                <div class="col-sm-2">
                    <button class="btn btn-secondary btn-block" type="button" @click="cropImage"
                            v-if="imgSrc != ''">
                        Crop
                    </button>
                    <button class="btn btn-secondary btn-block" type="button" @click="rotate" v-if="imgSrc != ''">
                        Rotate
                    </button>
                    <button class="btn btn-secondary btn-block" type="button" @click="deleteImg"
                            v-if="imgSrc != ''">Delete
                    </button>
                </div>
                <div v-if="cropImg" class="col-sm-5">
                    <img :src="cropImg"
                         alt="Cropped Image"/>
                </div>
            </div>
            <button class="btn btn-success" type="button" @click="save">Submit</button>
        </div>
        <detail-modal v-if="active" :active="active" :model="dataSummary"></detail-modal>
    </div>
</template>

<script>
    import StarRating from 'vue-star-rating';
    import VueCropper from 'vue-cropperjs';
    import 'cropperjs/dist/cropper.css';
    import datePicker from 'vue-bootstrap-datetimepicker';
    import 'pc-bootstrap4-datetimepicker/build/css/bootstrap-datetimepicker.css';
    import DetailModal from "./DetailsModal.vue"

    export default {
        name: "add-photo",
        components: {
            StarRating,
            VueCropper,
            datePicker,
            DetailModal
        },
        data() {
            return {
                active: false,
                imgSrc: '',
                cropImg: '',
                comfortRating: 0,
                legRoomRating: 0,
                viewRating: 0,
                selectedVenue: null,
                selectedSeat: null,
                selectedRow: null,
                selectedSection: null,
                visitDate: null,
                comment: null,
                dateOptions: {
                    format: 'DD/MM/YYYY h:mm:ss',
                    useCurrent: false,
                    showClear: true,
                    showClose: true,
                },
                dummyData: []
            };
        }, created() {
            this.dummyData = [
                {
                    venue: "a-test1",
                    sections: [
                        {section: "stalls", rows: [{row: "A", seats: [14, 15]}, {row: "B", seats: [12, 13]}]},
                        {section: "dress", rows: [{row: "D", seats: [14, 15]}, {row: "E", seats: [11, 112]}]}]
                },
                {
                    venue: "b-test1",
                    sections: [
                        {section: "2stalls", rows: [{row: "C", seats: [18, 19]}, {row: "D", seats: [9, 10]}]},
                        {section: "2dress", rows: [{row: "F", seats: [24, 25]}, {row: "G", seats: [31, 312]}]}]
                }];
        },
        computed: {
            sectionList() {
                return this.selectedVenue ? this.selectedVenue.sections : [];
            },
            rowList() {
                return this.selectedSection ? this.selectedSection.rows : [];
            },
            seatList() {
                return this.selectedRow ? this.selectedRow.seats : [];
            },
            dataSummary() {
                return {
                    venue: this.selectedVenue.venue,
                    section: this.selectedSection.section,
                    row: this.selectedRow.row,
                    seat: this.selectedSeat,
                    comment: this.comment,
                    date: this.visitDate,
                    comfortRating: this.comfortRating,
                    legRoomRating: this.legRoomRating,
                    viewRating: this.viewRating,
                    image: this.cropImg
                }
            }
        },
        methods: {
            save() {
                this.active = true;
            },
            setImage(e) {
                const file = e.target.files[0];
                if (!file.type.includes('image/')) {
                    alert('Please select an image file');
                    return;
                }
                if (typeof FileReader === 'function') {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        this.imgSrc = event.target.result;
                        // rebuild cropperjs with the updated source
                        if (this.$refs.cropper)
                            this.$refs.cropper.replace(event.target.result);
                    };
                    reader.readAsDataURL(file);
                } else {
                    alert('Sorry, FileReader API not supported');
                }
            },
            cropImage() {
                this.cropImg = this.$refs.cropper.getCroppedCanvas().toDataURL();
            },
            rotate() {
                this.$refs.cropper.rotate(90);
            },
            deleteImg() {
                this.imgSrc = null;
                this.cropImg = null;
            },
            callback(msg) {
                this.$notify(`Modal dismissed with msg '${msg}'.`)
            }
        }
    };
</script>

<style scoped>
    .container {
        position: relative;
        margin-top: 10px;
        font-family: Roboto, Helvetica Neue, Helvetica, Arial, sans-serif;
        color: #6b6b6b;
        font-weight: 700;
    }

    header {
        display: block;
        position: relative;
        background-color: #0576ae;
        height: 50px;
        -webkit-transition: background-color .2s ease;
        -o-transition: background-color .2s ease;
        transition: background-color .2s ease;
    }

    .header__logo-img {
        width: 103px;
        height: 20px;
        float: left;
        margin-top: 10px;
    }

    header form.nav-search fieldset {
        -webkit-box-shadow: 0;
        box-shadow: 0;
        border: 0;
        padding: 0;
        margin: 0;
        position: relative;
    }

    form fieldset {
        -webkit-box-shadow: 0;
        box-shadow: 0;
        margin: 0;
        position: relative;
        border-radius: 4px;
    }

    .nav-search {
        float: left;
        display: inline-block;
        border: 0;
        margin: 9px 0 0 20px;
        padding: 0;
    }

    header .nav-search input {
        float: left;
        width: 250px;
        height: 32px;
        padding: 0 35px 0 11px;
        border-radius: 4px;
        background-color: #025782;
        border: 0;
        color: #fff;
        -webkit-appearance: none;
        font-family: Roboto, Helvetica Neue, Helvetica, Arial, sans-serif;
        font-style: normal;
        font-weight: 400;
    }

    header form.nav-search .button {
        color: #fff;
        position: absolute;
        top: 2px;
        right: 2px;
        width: 32px;
        height: 28px;
        border-radius: 3px;
        background-color: #0576ae;
        font-family: Roboto, Helvetica Neue, Helvetica, Arial, sans-serif;
        font-style: normal;
        font-weight: 400;
    }

    header nav {
        float: right;
        position: relative;
    }

    header nav ul.master-nav > li {
        display: inline-block;
        float: left;
        height: 50px;
        margin: 0;
        padding: 0;
        width: auto;
        position: relative;
    }

    header nav ul.master-nav > li a.login-avatar.status-loggedin {
        width: 84px;
    }

    header nav ul.master-nav > li a.login-avatar {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        justify-content: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        padding: 0;
    }

    header nav ul.master-nav > li a {
        color: #fff;
        width: 100%;
        height: 100%;
        padding: 0 15px;
        display: block;
        font-size: 14px;
        text-decoration: none;
        font-weight: 500;
    }

    .section-hero {
        background-color: #143852;
        text-align: left;
        padding: 50px 0 15px;
    }

    .section-container {
        max-width: 1130px;
        margin-left: auto;
        margin-right: auto;
        position: relative;
    }

    .section-hero h1 {
        color: #fff;
        font-size: 42px;
        font-size: 2.625rem;
        font-weight: 400;
        line-height: 49px;
        margin-top: 0;
        margin-bottom: 20px;
        -webkit-transition: all .3s ease;
        -o-transition: all .3s ease;
        transition: all .3s ease;
    }

    .section-hero p {
        color: #fff;
    }

    .col-form-label {
        text-align: left !important;
    }

    input, form, select, textarea {
        display: inline-block;
        border: 1px solid #d5d5d5 !important;
        background-color: #f2f4f5;
    }

    ul {
        margin: 0;
        padding: 0;
        list-style: none;
    }
</style>
