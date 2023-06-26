<template>
  <div>
    <app-form v-model="formState" :rules="formRules" @finish="handleFormSubmit">
      <template #formContent="{ modelRef,validateInfos }">
        <a-form-item
          name="select"
          label="Select"
          has-feedback
          v-bind="validateInfos.select"
        >
          <a-select v-model:value="modelRef.select" placeholder="Please select a country">
            <a-select-option value="china">China</a-select-option>
            <a-select-option value="usa">U.S.A</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item
          name="select-multiple"
          label="Select[multiple]"
          v-bind="validateInfos['select-multiple']"
        >
          <a-select
            v-model:value="modelRef['select-multiple']"
            mode="multiple"
            placeholder="Please select favourite colors"
          >
            <a-select-option value="red">Red</a-select-option>
            <a-select-option value="green">Green</a-select-option>
            <a-select-option value="blue">Blue</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="InputNumber" name="input-number">
          <a-form-item name="input-number" no-style>
            <a-input-number v-model:value="modelRef['input-number']" :min="1" :max="10" />
          </a-form-item>
          <span class="ant-form-text">machines</span>
        </a-form-item>




        <a-form-item name="switch" label="Switch">
          <a-switch v-model:checked="modelRef.switch" />
        </a-form-item>

        <a-form-item name="slider" label="Slider">
          <a-slider
            v-model:value="modelRef.slider"
            :marks="{
              0: 'A',
              20: 'B',
              40: 'C',
              60: 'D',
              80: 'E',
              100: 'F'
            }"
          />
        </a-form-item>

        <a-form-item name="radio-group" label="Radio.Group"  >
          <a-radio-group v-model:value="modelRef['radio-group']">
            <a-radio value="a">item 1</a-radio>
            <a-radio value="b">item 2</a-radio>
            <a-radio value="c">item 3</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item
          name="radio-button"
          label="Radio.Button"
          v-bind="validateInfos['radio-button']"
        >
          <a-radio-group v-model:value="modelRef['radio-button']">
            <a-radio-button value="a">item 1</a-radio-button>
            <a-radio-button value="b">item 2</a-radio-button>
            <a-radio-button value="c">item 3</a-radio-button>
          </a-radio-group>
        </a-form-item>

        <a-form-item name="checkbox-group" label="Checkbox.Group">
          <a-checkbox-group v-model:value="modelRef['checkbox-group']">
            <a-row>
              <a-col :span="8">
                <a-checkbox value="A" style="line-height: 32px">A</a-checkbox>
              </a-col>
              <a-col :span="8">
                <a-checkbox value="B" style="line-height: 32px" disabled>B</a-checkbox>
              </a-col>
              <a-col :span="8">
                <a-checkbox value="C" style="line-height: 32px">C</a-checkbox>
              </a-col>
              <a-col :span="8">
                <a-checkbox value="D" style="line-height: 32px">D</a-checkbox>
              </a-col>
              <a-col :span="8">
                <a-checkbox value="E" style="line-height: 32px">E</a-checkbox>
              </a-col>
              <a-col :span="8">
                <a-checkbox value="F" style="line-height: 32px">F</a-checkbox>
              </a-col>
            </a-row>
          </a-checkbox-group>
        </a-form-item>

        <a-form-item name="rate" label="Rate">
          <a-rate v-model:value="modelRef.rate" allow-half />
        </a-form-item>

        <a-form-item name="upload" label="Upload" extra="longgggggggggggggggggggggggggggggggggg">
          <a-upload
            v-model:fileList="modelRef.upload"
            name="logo"
            action="/upload.do"
            list-type="picture"
          >
            <a-button>
              <template #icon><UploadOutlined /></template>
              Click to upload
            </a-button>
          </a-upload>
        </a-form-item>

        <a-form-item label="Dragger">
          <a-form-item name="dragger" no-style>
            <a-upload-dragger v-model:fileList="modelRef.dragger" name="files" action="/upload.do">
              <p class="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p class="ant-upload-text">Click or drag file to this area to upload</p>
              <p class="ant-upload-hint">Support for a single or bulk upload.</p>
            </a-upload-dragger>
          </a-form-item>
        </a-form-item>
      </template>
    </app-form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { UploadOutlined, InboxOutlined } from '@ant-design/icons-vue'
import type { Rule } from 'ant-design-vue/es/form';
const formState = reactive<Record<string, any>>({
  select:undefined,
  'select-multiple':[],
  'radio-button':'',
  'input-number': 1,
  'checkbox-group': [],
  rate: 3.5
})

const formRules:Record<string,Rule[]> = {
  'select': [{ required: true, message: 'Please select your country!' }],
  'select-multiple': [{ required: true, message: 'Please select your favourite colors!', type: 'array' }],
  'radio-button': [{ required: true, message: 'Please pick an item!' }]
}

const handleFormSubmit = (values: any) => {
  console.log('values', values)
}
</script>

<style lang="scss" scoped></style>
