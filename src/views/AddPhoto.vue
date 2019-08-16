<template>
    <div>
        <section class="section-hero">
            <div class="section-container"><h1>Add Photo Form</h1></div>
        </section>


        <div class="container">
            <div class="form-group row">
                <label class="col-sm-2 col-form-label">Photo</label>
                <input type="file" name="image" accept="image/*"
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
                    <option disabled value="">Please select one</option>
                    <option v-for="s in sectionList" v-bind:value="s">{{s.section}}</option>
                </select>
                <span>{{ errors.first('Section') }}</span>
            </div>
            <div class="form-group row">
                <label class="col-sm-2 col-form-label">Row</label>
                <select class="form-control col-sm-2" v-model="selectedRow">
                    <option disabled value="">Please select one</option>
                    <option v-for="r in rowList" v-bind:value="r">{{r.row}}</option>
                </select>
            </div>
            <div class="form-group row">
                <label class="col-sm-2 col-form-label">Seat</label>
                <select class="form-control col-sm-2" v-model="selectedSeat">
                    <option disabled value="">Please select one</option>
                    <option v-for="s in seatList" v-bind:value="s">{{s}}</option>
                </select>
            </div>
            <div class="form-group row">
                <label class="col-sm-2 col-form-label">Date of visit</label>
                <date-picker class="col-sm-2" v-model="visitDate" :config="dateOptions"></date-picker>
            </div>
            <div class="form-group row">
                <label class="col-sm-2 col-form-label">Comfort</label>
                <star-rating v-model="comfortRating" :star-size="20"></star-rating>
            </div>
            <div class="form-group row">
                <label class="col-sm-2 col-form-label">Legroom</label>
                <star-rating v-model="legRoomRating" :star-size="20"></star-rating>
            </div>
            <div class="form-group row">
                <label class="col-sm-2 col-form-label">View</label>
                <star-rating v-model="viewRating" :star-size="20"></star-rating>
            </div>
            <div class="form-group row">
                <label class="col-sm-2 col-form-label">Comment</label>
                <textarea v-model="comment" class="col-sm-4 form-control" autocomplete="off"></textarea>
            </div>
            <button class="btn btn-primary" type="button" @click="save">Submit</button>
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
</style>
