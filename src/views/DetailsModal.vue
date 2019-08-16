<template>
    <b-modal v-model="active" size="xl">
        <div class="form-group row">
            <table class="table col-sm-8">
                <th>Venue</th>
                <th>Section</th>
                <th>Row</th>
                <th>Seat</th>
                <th>Comment</th>
                <th>Visit Date</th>
                <tr>
                    <td>{{venueValue}}</td>
                    <td>{{sectionValue}}</td>
                    <td>{{rowValue}}</td>
                    <td>{{seatValue}}</td>
                    <td>{{commentValue}}</td>
                    <td>{{dateValue}}</td>
                </tr>
            </table>
            <div class="col-sm-4">
                <img :src="image"
                     alt="Image"/>
            </div>
        </div>
        <div class="form-group row">
            <label class="col-sm-2 col-form-label">Comfort</label>
            <star-rating :star-size="20" read-only :rating="comfortRatingValue"></star-rating>
        </div>
        <div class="form-group row">
            <label class="col-sm-2 col-form-label">Legroom</label>
            <star-rating :star-size="20" read-only :rating="legRoomRatingValue"></star-rating>
        </div>
        <div class="form-group row">
            <label class="col-sm-2 col-form-label">View</label>
            <star-rating :star-size="20" read-only :rating="viewRatingValue"></star-rating>
        </div>

    </b-modal>
</template>

<script>
    import {BModal} from 'bootstrap-vue'
    import StarRating from 'vue-star-rating';

    export default {
        name: "detail-modal",
        components: {BModal, StarRating},
        props: {
            active: {type: Boolean, required: true},
            model: {type: Object, required: true}
        },
        computed: {
            venueValue() {
                return this.model.venue;
            },
            sectionValue() {
                return this.model.section;
            },
            rowValue() {
                return this.model.row;
            },
            seatValue() {
                return this.model.seat;
            },
            commentValue() {
                return this.model.comment;
            },
            dateValue() {
                return this.model.date;
            },
            comfortRatingValue() {
                return this.model.comfortRating;
            },
            legRoomRatingValue() {
                return this.model.legRoomRating;
            },
            viewRatingValue() {
                return this.model.viewRating;
            },
            image() {
                return this.model.image;
            }
        }
    };
</script>
