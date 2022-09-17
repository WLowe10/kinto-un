declare class Kinto {
    views: any[];
    constructor();
    render: (name: string, props?: {} | undefined) => Promise<void>;
}
export default Kinto;
