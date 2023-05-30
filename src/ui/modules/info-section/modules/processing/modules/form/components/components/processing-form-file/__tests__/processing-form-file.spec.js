import { shallowMount, mount } from '@vue/test-utils';
import ProcessingFormFile from '../processing-form-file.vue';

describe('ProcessingFormFile', () => {
  const clientInstance = {
    storeFile: () => {},
  };

  const client = { getCliInstance: () => clientInstance };
  const computed = {
    client: () => client,
  };

  it('renders a component', () => {
    const wrapper = shallowMount(ProcessingFormFile, {
      props: {
        value: [],
      },
      computed,
    });
    expect(wrapper.isVisible()).toBe(true);
  });
  it('handleDrop calls uploadFile with received file', () => {
    const file = {};
    const event = { dataTransfer: { files: [file] } };
    const mock = jest.fn();
    jest.spyOn(ProcessingFormFile.methods, 'uploadFile')
        .mockImplementationOnce(mock);
    const wrapper = shallowMount(ProcessingFormFile, {
      props: {
        value: [],
      },
      computed,
    });
    wrapper.vm.handleDrop(event);
    expect(mock).toHaveBeenCalledWith(file);
  });
  it('handleFileInput calls uploadFile with received file', () => {
    const file = {};
    const event = { target: { files: [file] } };
    const mock = jest.fn();
    jest.spyOn(ProcessingFormFile.methods, 'handleFileInput')
        .mockImplementationOnce(mock);
    const wrapper = mount(ProcessingFormFile, {
      props: {
        value: [],
      },
      computed,
    });
    wrapper.vm.handleFileInput(event);
    expect(mock).toHaveBeenCalledWith({ target: { files: [file] } });
  });
  it('uploadFile calls cli.storeFile with passed file', async () => {
    const file = { id: 'jest' };
    const mock = jest.fn();
    clientInstance.storeFile = mock;
    const wrapper = shallowMount(ProcessingFormFile, {
      props: {
        value: [],
      },
      computed,
    });
    wrapper.vm.uploadFile(file);
    await wrapper.vm.$nextTick();
    expect(mock.mock.calls[0][1]).toEqual([file]);
  });
  it('uploadFile adds file snapshot to uploadingSnapshots list', async () => {
    const wrapper = shallowMount(ProcessingFormFile, {
      props: {
        value: [],
      },
      computed,
    });
    expect(wrapper.vm.uploadingSnapshots.length).toBe(0);
    wrapper.vm.uploadFile({});
    expect(wrapper.vm.uploadingSnapshots.length).toBe(1);
  });
  it('uploadFile calls handleFileSuccessUpload', async () => {
    const mock = jest.fn();
    jest.spyOn(ProcessingFormFile.methods, 'handleFileSuccessUpload')
        .mockImplementationOnce(mock);
    const wrapper = shallowMount(ProcessingFormFile, {
      props: {
        value: [],
      },
      computed,
    });
    await wrapper.vm.uploadFile({});
    expect(mock).toHaveBeenCalled();
  });
  it('uploadFile calls handleFileErrorUpload if error is thrown', async () => {
    const mock = jest.fn();
    jest.spyOn(ProcessingFormFile.methods, 'handleFileErrorUpload')
        .mockImplementationOnce(mock);
    const wrapper = shallowMount(ProcessingFormFile, {
      props: {
        value: [],
      },
      computed,
    });
    clientInstance.storeFile = () => {
      throw Error;
    };
    await wrapper.vm.uploadFile({});
    expect(mock).toHaveBeenCalled();
  });
  it('handleFileSuccessUpload sets passed snapshot "done" flag to true', () => {
    const wrapper = shallowMount(ProcessingFormFile, {
      props: {
        value: [],
      },
      computed,
    });
    const snapshot = { metadata: { done: false } };
    wrapper.vm.handleFileSuccessUpload({ snapshot });
    expect(snapshot.metadata.done).toBe(true);
  });
  jest.useFakeTimers();
  it('handleFileSuccessUpload replaces snapshot with a passed file', () => {
    const wrapper = shallowMount(ProcessingFormFile, {
      props: {
        value: [],
      },
      computed,
    });
    const snapshot = { metadata: {} };
    const file = {};
    // wrapper.setData({ uploadingSnapshots: [snapshot] });
    wrapper.vm.uploadingSnapshots = [snapshot];

    expect(wrapper.vm.uploadingSnapshots.length).toBe(1);
    wrapper.vm.handleFileSuccessUpload({ snapshot, file });

    jest.runAllTimers();
    expect(wrapper.vm.uploadingSnapshots.length).toBe(0);
    expect(wrapper.emitted().input[0][0]).toEqual([file]);
  });
  it('handleFileErrorUpload sets passed snapshot "error" flag to true', () => {
    const wrapper = shallowMount(ProcessingFormFile, {
      props: {
        value: [],
      },
      computed,
    });
    const snapshot = { metadata: { error: false } };
    wrapper.vm.handleFileErrorUpload({ snapshot });
    expect(snapshot.metadata.error).toBe(true);
  });
  jest.useFakeTimers();
  it('handleFileErrorUpload adds close method to snapshot which deletes it from uploadingSnapshots', () => {
    const wrapper = shallowMount(ProcessingFormFile, {
      props: {
        value: [],
      },
      computed,
    });
    const snapshot = { metadata: {} };
    // wrapper.setData({ uploadingSnapshots: [snapshot] });
    wrapper.vm.uploadingSnapshots = [snapshot];
    expect(wrapper.vm.uploadingSnapshots.length).toBe(1);

    wrapper.vm.handleFileErrorUpload({ snapshot });

    jest.runAllTimers();
    expect(snapshot.metadata.close).toBeTruthy();
    snapshot.metadata.close();
    expect(wrapper.vm.uploadingSnapshots.length).toBe(0);
  });
  it('handleDeleteConfirm emits input event without passed file', () => {
    const file = { id: 1 };
    const wrapper = shallowMount(ProcessingFormFile, {
      props: {
        value: [file, { id: 2 }],
      },
      computed,
    });
    wrapper.setData({ deletedFile: file });
    wrapper.vm.handleDeleteConfirm();
    expect(wrapper.emitted().input[0][0]).toEqual([{ id: 2 }]);
  });
});
