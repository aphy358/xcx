
Component({
  properties: {

  },

  data: {

  },

  methods: {
    showOrderDetail(){
      this.triggerEvent('showOrderDetail')
    },
    rePay(){
      this.triggerEvent('rePay')
    }
  }
})
