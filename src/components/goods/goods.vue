<template>
  <div class="goods">
    <div class="menu-wrapper" v-el:menu-wrapper>
      <ul>
        <li class="menu-item" v-for="item in goods" :class="{'current':currentIndex===$index}" @click="selectMenu($index)">
          <span class="text border-1px">
            <span 
              v-show="item.type > 0"
              :class="classMap[item.type]"
              class="icon"
              
            ></span
            >{{ item.name }}
          </span>
        </li>
      </ul>
    </div>

    <div class="foods-wrapper" v-el:foods-wrapper>
      <ul>
        <li v-for="item in goods" class="food-list food-list-hook" >
          <h1 class="title">{{ item.name }}</h1>
          <ul>
            <li v-for="food in item.foods" class="food-item border-1px" @click="selectFood(food,$event)">
              <div class="icon">
                <img
                  :src="food.icon"
                  alt=""
                  style="width: 57px; height: 57px;"
                />
              </div>

              <div class="content">
                <h2 class="name">{{ food.name }}</h2>
                <p class="desc">{{ food.description }}</p>
                <div class="extra">
                  <span class="count">月售{{ food.sellCount }}份</span><span>好评率{{ food.rating }}</span>
                </div>
                <div class="price">
                  <span class="now">￥{{ food.price }}</span><span v-show="food.oldPrice" class="old"
                    >￥{{ food.oldPrice }}</span
                  >
                </div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol :food="food"></cartcontrol>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <shopcart v-ref:shopcart  :select-foods="selectFoods"   :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopcart>
      <food :food="selectedFood" v-ref:food></food>
  </div>

</template>

<script>
import shopcart from 'components/shopcart/shopcart'
import BScroll from "better-scroll";
import cartcontrol from 'components/cartcontrol/cartcontrol'
import food from 'components/food/food'
export default {
  props: {
    seller: { type: Object },
  },
  components:{
    shopcart,
    cartcontrol,
    food
  },
  data() {
    return {
      goods: [],
      classMap: ["decrease", "discount", "special", "invoice", "guarantee"],
      ListHeight: [],
      scrollY:0,
      selectFoods:[],
      selectedFood:{},
      // currentIndex:0
    };
  },
  created() {
    this.$http.get("/api/goods").then((response) => {
      response = response.body;
      if (response.errno == 0) {
        this.goods = response.data;
        // console.log(this.goods);
        this.$nextTick(() => {
          this._initScroll();
          this._calculateHeight();
        });
      }
    });
    this.classMap = ["decrease", "discount", "special", "invoice", "guarantee"];
  },
  methods: {
    _initScroll() {
      this.menuScroll = new BScroll(this.$els.menuWrapper, {
        click:true
      });
      this.foodsScroll = new BScroll(this.$els.foodsWrapper, {
        probeType:3,
        click:true
      });
      this.foodsScroll.on('scroll',(pos)=>{
        this.scrollY=Math.abs(Math.round(pos.y));
        // console.log(this.scrollY)
        // console.log(this.ListHeight)
        // console.log(this.currentIndex)
      });
    },
    selectFood(food,event){
      this.selectedFood=food;
      this.$refs.food.show();
      // console.log(1)

    },
    _drop(target) {
   this.$refs.shopcart.drop(target);
    },
    _calculateHeight(){
        let foodList=this.$els.foodsWrapper.getElementsByClassName('food-list-hook');
        let height=0;
        this.ListHeight.push(height);
        // console.log(foodList)
        for(let i=0;i<foodList.length;i++)
        {
          let item=foodList[i];
          height+=item.clientHeight;//得到DOM高度
          this.ListHeight.push(height);
          // console.log(height)
        }
    },
    selectMenu(index,event){
        // if(!event._constructed){
        //   return ;
        // }
        console.log(index);
        let foodList=this.$els.foodsWrapper.getElementsByClassName('food-list-hook')
        // console.log(foodList[index])
        let el=foodList[index]
        this.foodsScroll.scrollToElement(el,300)
    }
  },
  computed: {
    currentIndex(){
        for(let i=0;i<this.ListHeight.length;i++){
          let height1=this.ListHeight[i];
          let height2=this.ListHeight[i+1];
          if(!height2||(this.scrollY>=height1&&this.scrollY<height2)){
            // console.log(i);
            return i;
          }
        
        }
        return 0;
    },
    selectFoods(){
      let foods=[];
      this.goods.forEach((good)=>{
         good.foods.forEach((food)=>{
            if(food.count){
              foods.push(food)
            }
         })
      });
      return foods;
    }
  },
  events:{
      'cart.add' (target) {
      this._drop (target)}
  },
};
</script>
<style lang="stylus">
@import "../../common/stylus/mixin.styl";
.goods
  display: flex
  position: absolute
  top: 176.5px
  bottom: 46px
  width: 100%
  overflow: hidden

  .menu-wrapper
    flex: 0 0 80px;
    width: 80px;
    background: #f3f5f7
    .menu-item
      display table//
      height  54px
      width 56px
      line-height 14px
      padding 0 12px
      text-align center
      &.current
        background #fff 
        position relative
        margin-top -1px
        z-index 10
        font-weight 700
        .text
          border none 
      .icon
        display inline-block
        width 16px
        height 16px
        vertical-align top
        margin-right 2px
        background-size 16px 16px
        background-repeat no-repeat
        // align-content center
        text-align center
        &.decrease
          bg-image('decrease_3')
        &.discount
          bg-image('discount_3')
        &.guarantee
          bg-image('guarantee_3')
        &.invoice
          bg-image('invoice_3')
        &.special
          bg-image('special_3')
      .text
        display table-cell//像单元表格一样
        width 56px
        vertical-align middle//he table-cell一起实现文字垂直居中
        font-size 12px
        align-content center
        border-1px(rgba(7,17,27,0.1))
        text-align center
  .foods-wrapper
    flex: 1
    // width 100%
    // padding-right  20px
    .title
      padding 14px
      height 26px
      // width 100px
      // width 50%
      line-height 26px
      border-left 1px solid #d9dde1
      font-size 12px
      color rgb(147,153,159)
      background #f3f5f7
    .food-item
      display flex
      margin 18px
      padding-bottom 18px
      border-1px(rgba(7,17,27,0.1))
      background white
      // border 7px dotted  rgba(7,17,27,0.1)
      &:last-child
        &:after
          display none
          padding-bottom 0px
      .icon
        flex 0 0 57px
        margin-right 10px
      .content
        flex 1
        .name
          font-size 14px
          margin 2px 0 8px 0
          height 14px
          line-height 14px
          color rgb(7,17,27)
          // background red
        .desc
        
          line-height 10px
          // height 10px
          font-size 10px
          color rgb(147,153,159)
          line-height: 12px
          padding-bottom 8px
         
        .extra
          line-height 10px
          font-size 10px
          color rgb(147,153,159)
          .count
            margin-right 12px
        .price
          font-weight 700
          line-height 24px
          .now
            margin-right 8px
            font-size 14px
            color red
          .old
            text-decoration line-through
            font-size 10px
            color rgb(147,153,159)
        .cartcontrol-wrapper
          position absolute
          right 0
          bottom 12px
          
          
</style>
